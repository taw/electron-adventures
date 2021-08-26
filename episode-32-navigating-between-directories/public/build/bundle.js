
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Panel.svelte generated by Svelte v3.42.1 */

    const { window: window_1$2 } = globals;
    const file$2 = "src/Panel.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[31] = list;
    	child_ctx[32] = i;
    	return child_ctx;
    }

    // (143:4) {#each files as file, idx}
    function create_each_block(ctx) {
    	let div;
    	let t0_value = /*filySymbol*/ ctx[11](/*file*/ ctx[30]) + "";
    	let t0;
    	let t1_value = /*file*/ ctx[30].name + "";
    	let t1;
    	let t2;
    	let idx = /*idx*/ ctx[32];
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[16](/*idx*/ ctx[32]);
    	}

    	function contextmenu_handler() {
    		return /*contextmenu_handler*/ ctx[17](/*idx*/ ctx[32]);
    	}

    	function dblclick_handler() {
    		return /*dblclick_handler*/ ctx[18](/*idx*/ ctx[32]);
    	}

    	const assign_div = () => /*div_binding*/ ctx[19](div, idx);
    	const unassign_div = () => /*div_binding*/ ctx[19](null, idx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "file svelte-wsrw2x");
    			toggle_class(div, "focused", /*idx*/ ctx[32] === /*focusedIdx*/ ctx[4]);
    			toggle_class(div, "selected", /*selected*/ ctx[5].includes(/*idx*/ ctx[32]));
    			add_location(div, file$2, 143, 6, 3442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			assign_div();

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", prevent_default(click_handler), false, true, false),
    					listen_dev(div, "contextmenu", prevent_default(contextmenu_handler), false, true, false),
    					listen_dev(div, "dblclick", prevent_default(dblclick_handler), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*files*/ 8 && t0_value !== (t0_value = /*filySymbol*/ ctx[11](/*file*/ ctx[30]) + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*files*/ 8 && t1_value !== (t1_value = /*file*/ ctx[30].name + "")) set_data_dev(t1, t1_value);

    			if (idx !== /*idx*/ ctx[32]) {
    				unassign_div();
    				idx = /*idx*/ ctx[32];
    				assign_div();
    			}

    			if (dirty[0] & /*focusedIdx*/ 16) {
    				toggle_class(div, "focused", /*idx*/ ctx[32] === /*focusedIdx*/ ctx[4]);
    			}

    			if (dirty[0] & /*selected*/ 32) {
    				toggle_class(div, "selected", /*selected*/ ctx[5].includes(/*idx*/ ctx[32]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			unassign_div();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(143:4) {#each files as file, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let header;
    	let t0_value = /*directory*/ ctx[2].split("/").slice(-1)[0] + "";
    	let t0;
    	let t1;
    	let div0;
    	let div1_class_value;
    	let mounted;
    	let dispose;
    	let each_value = /*files*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			header = element("header");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(header, "class", "svelte-wsrw2x");
    			add_location(header, file$2, 140, 2, 3301);
    			attr_dev(div0, "class", "file-list svelte-wsrw2x");
    			add_location(div0, file$2, 141, 2, 3356);
    			attr_dev(div1, "class", div1_class_value = "panel " + /*position*/ ctx[0] + " svelte-wsrw2x");
    			toggle_class(div1, "active", /*active*/ ctx[1]);
    			add_location(div1, file$2, 139, 0, 3246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);
    			append_dev(header, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			/*div0_binding*/ ctx[20](div0);

    			if (!mounted) {
    				dispose = listen_dev(window_1$2, "keydown", /*handleKey*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*directory*/ 4 && t0_value !== (t0_value = /*directory*/ ctx[2].split("/").slice(-1)[0] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*fileNodes, focusedIdx, selected, onclick, onrightclick, ondoubleclick, files, filySymbol*/ 3960) {
    				each_value = /*files*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*position*/ 1 && div1_class_value !== (div1_class_value = "panel " + /*position*/ ctx[0] + " svelte-wsrw2x")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*position, active*/ 3) {
    				toggle_class(div1, "active", /*active*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			/*div0_binding*/ ctx[20](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let filesPromise;
    	let filesCount;
    	let focused;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Panel', slots, []);
    	let { initialDirectory } = $$props;
    	let { position } = $$props;
    	let { active } = $$props;
    	let { onActivate } = $$props;
    	let directory = initialDirectory;
    	let initialFocus;
    	let files = [];
    	let selected = [];
    	let focusedIdx = 0;
    	let fileNodes = [];
    	let fileListNode;

    	let flipSelected = idx => {
    		if (selected.includes(idx)) {
    			$$invalidate(5, selected = selected.filter(f => f !== idx));
    		} else {
    			$$invalidate(5, selected = [...selected, idx]);
    		}
    	};

    	let setInitialFocus = async () => {
    		$$invalidate(4, focusedIdx = 0);

    		if (initialFocus) {
    			$$invalidate(4, focusedIdx = files.findIndex(x => x.name === initialFocus));

    			if (focusedIdx === -1) {
    				$$invalidate(4, focusedIdx = 0);
    			}
    		} else {
    			$$invalidate(4, focusedIdx = 0);
    		}

    		await tick();
    		scrollFocusedIntoView();
    	};

    	let scrollFocusedIntoView = () => {
    		if (fileNodes[focusedIdx]) {
    			fileNodes[focusedIdx].scrollIntoViewIfNeeded(true);
    		}
    	};

    	let focusOn = idx => {
    		$$invalidate(4, focusedIdx = idx);

    		if (focusedIdx > filesCount - 1) {
    			$$invalidate(4, focusedIdx = filesCount - 1);
    		}

    		if (focusedIdx < 0) {
    			$$invalidate(4, focusedIdx = 0);
    		}

    		scrollFocusedIntoView();
    	};

    	let onclick = idx => {
    		onActivate();
    		focusOn(idx);
    	};

    	let onrightclick = idx => {
    		onActivate();
    		focusOn(idx);
    		flipSelected(idx);
    	};

    	let ondoubleclick = idx => {
    		onActivate();
    		focusOn(idx);
    		enterCommand();
    	};

    	let pageSize = () => {
    		if (!fileNodes[0] || !fileNodes[1] || !fileListNode) {
    			return 16;
    		}

    		let y0 = fileNodes[0].getBoundingClientRect().y;
    		let y1 = fileNodes[1].getBoundingClientRect().y;
    		let yh = fileListNode.getBoundingClientRect().height;
    		return Math.floor(yh / (y1 - y0));
    	};

    	let enterCommand = () => {
    		if (focused?.type === "directory") {
    			if (focused.name === "..") {
    				initialFocus = directory.split("/").slice(-1)[0];
    				$$invalidate(2, directory = directory.split("/").slice(0, -1).join("/") || "/");
    			} else {
    				initialFocus = null;
    				$$invalidate(2, directory += "/" + focused.name);
    			}
    		}
    	};

    	let filySymbol = file => {
    		if (file.type === "directory") {
    			if (file.linkTarget) {
    				return "~";
    			} else {
    				return "/";
    			}
    		} else if (file.type === "special") {
    			return "-";
    		} else {
    			if (file.linkTarget) {
    				return "@";
    			} else {
    				return "\xA0"; // &nbsp;
    			}
    		}
    	};

    	let handleKey = e => {
    		if (!active) {
    			return;
    		}

    		if (e.key === "ArrowDown") {
    			focusOn(focusedIdx + 1);
    		} else if (e.key === "ArrowUp") {
    			focusOn(focusedIdx - 1);
    		} else if (e.key === "PageDown") {
    			focusOn(focusedIdx + pageSize());
    		} else if (e.key === "PageUp") {
    			focusOn(focusedIdx - pageSize());
    		} else if (e.key === "Home") {
    			focusOn(0);
    		} else if (e.key === "End") {
    			focusOn(filesCount - 1);
    		} else if (e.key === " ") {
    			flipSelected(focusedIdx);
    			focusOn(focusedIdx + 1);
    		} else if (e.key === "Enter") {
    			enterCommand();
    		} else {
    			return;
    		}

    		e.preventDefault();
    	};

    	const writable_props = ['initialDirectory', 'position', 'active', 'onActivate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Panel> was created with unknown prop '${key}'`);
    	});

    	const click_handler = idx => onclick(idx);
    	const contextmenu_handler = idx => onrightclick(idx);
    	const dblclick_handler = idx => ondoubleclick(idx);

    	function div_binding($$value, idx) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileNodes[idx] = $$value;
    			$$invalidate(6, fileNodes);
    		});
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileListNode = $$value;
    			$$invalidate(7, fileListNode);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('initialDirectory' in $$props) $$invalidate(13, initialDirectory = $$props.initialDirectory);
    		if ('position' in $$props) $$invalidate(0, position = $$props.position);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('onActivate' in $$props) $$invalidate(14, onActivate = $$props.onActivate);
    	};

    	$$self.$capture_state = () => ({
    		tick,
    		initialDirectory,
    		position,
    		active,
    		onActivate,
    		directory,
    		initialFocus,
    		files,
    		selected,
    		focusedIdx,
    		fileNodes,
    		fileListNode,
    		flipSelected,
    		setInitialFocus,
    		scrollFocusedIntoView,
    		focusOn,
    		onclick,
    		onrightclick,
    		ondoubleclick,
    		pageSize,
    		enterCommand,
    		filySymbol,
    		handleKey,
    		filesCount,
    		focused,
    		filesPromise
    	});

    	$$self.$inject_state = $$props => {
    		if ('initialDirectory' in $$props) $$invalidate(13, initialDirectory = $$props.initialDirectory);
    		if ('position' in $$props) $$invalidate(0, position = $$props.position);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('onActivate' in $$props) $$invalidate(14, onActivate = $$props.onActivate);
    		if ('directory' in $$props) $$invalidate(2, directory = $$props.directory);
    		if ('initialFocus' in $$props) initialFocus = $$props.initialFocus;
    		if ('files' in $$props) $$invalidate(3, files = $$props.files);
    		if ('selected' in $$props) $$invalidate(5, selected = $$props.selected);
    		if ('focusedIdx' in $$props) $$invalidate(4, focusedIdx = $$props.focusedIdx);
    		if ('fileNodes' in $$props) $$invalidate(6, fileNodes = $$props.fileNodes);
    		if ('fileListNode' in $$props) $$invalidate(7, fileListNode = $$props.fileListNode);
    		if ('flipSelected' in $$props) flipSelected = $$props.flipSelected;
    		if ('setInitialFocus' in $$props) $$invalidate(25, setInitialFocus = $$props.setInitialFocus);
    		if ('scrollFocusedIntoView' in $$props) scrollFocusedIntoView = $$props.scrollFocusedIntoView;
    		if ('focusOn' in $$props) focusOn = $$props.focusOn;
    		if ('onclick' in $$props) $$invalidate(8, onclick = $$props.onclick);
    		if ('onrightclick' in $$props) $$invalidate(9, onrightclick = $$props.onrightclick);
    		if ('ondoubleclick' in $$props) $$invalidate(10, ondoubleclick = $$props.ondoubleclick);
    		if ('pageSize' in $$props) pageSize = $$props.pageSize;
    		if ('enterCommand' in $$props) enterCommand = $$props.enterCommand;
    		if ('filySymbol' in $$props) $$invalidate(11, filySymbol = $$props.filySymbol);
    		if ('handleKey' in $$props) $$invalidate(12, handleKey = $$props.handleKey);
    		if ('filesCount' in $$props) filesCount = $$props.filesCount;
    		if ('focused' in $$props) focused = $$props.focused;
    		if ('filesPromise' in $$props) $$invalidate(15, filesPromise = $$props.filesPromise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*directory*/ 4) {
    			$$invalidate(15, filesPromise = window.api.directoryContents(directory));
    		}

    		if ($$self.$$.dirty[0] & /*filesPromise*/ 32768) {
    			filesPromise.then(x => {
    				$$invalidate(3, files = x);
    				$$invalidate(5, selected = []);
    				setInitialFocus();
    			});
    		}

    		if ($$self.$$.dirty[0] & /*files*/ 8) {
    			filesCount = files.length;
    		}

    		if ($$self.$$.dirty[0] & /*files, focusedIdx*/ 24) {
    			focused = files[focusedIdx];
    		}
    	};

    	return [
    		position,
    		active,
    		directory,
    		files,
    		focusedIdx,
    		selected,
    		fileNodes,
    		fileListNode,
    		onclick,
    		onrightclick,
    		ondoubleclick,
    		filySymbol,
    		handleKey,
    		initialDirectory,
    		onActivate,
    		filesPromise,
    		click_handler,
    		contextmenu_handler,
    		dblclick_handler,
    		div_binding,
    		div0_binding
    	];
    }

    class Panel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				initialDirectory: 13,
    				position: 0,
    				active: 1,
    				onActivate: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Panel",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*initialDirectory*/ ctx[13] === undefined && !('initialDirectory' in props)) {
    			console.warn("<Panel> was created without expected prop 'initialDirectory'");
    		}

    		if (/*position*/ ctx[0] === undefined && !('position' in props)) {
    			console.warn("<Panel> was created without expected prop 'position'");
    		}

    		if (/*active*/ ctx[1] === undefined && !('active' in props)) {
    			console.warn("<Panel> was created without expected prop 'active'");
    		}

    		if (/*onActivate*/ ctx[14] === undefined && !('onActivate' in props)) {
    			console.warn("<Panel> was created without expected prop 'onActivate'");
    		}
    	}

    	get initialDirectory() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialDirectory(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onActivate() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onActivate(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.42.1 */

    const { window: window_1$1 } = globals;
    const file$1 = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t7;
    	let button4;
    	let t9;
    	let button5;
    	let t11;
    	let button6;
    	let t13;
    	let button7;
    	let t15;
    	let button8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			button0 = element("button");
    			button0.textContent = "F1 Help";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "F2 Menu";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "F3 View";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "F4 Edit";
    			t7 = space();
    			button4 = element("button");
    			button4.textContent = "F5 Copy";
    			t9 = space();
    			button5 = element("button");
    			button5.textContent = "F6 Move";
    			t11 = space();
    			button6 = element("button");
    			button6.textContent = "F7 Mkdir";
    			t13 = space();
    			button7 = element("button");
    			button7.textContent = "F8 Delete";
    			t15 = space();
    			button8 = element("button");
    			button8.textContent = "F10 Quit";
    			attr_dev(button0, "class", "svelte-vkfdfd");
    			add_location(button0, file$1, 14, 2, 193);
    			attr_dev(button1, "class", "svelte-vkfdfd");
    			add_location(button1, file$1, 15, 2, 220);
    			attr_dev(button2, "class", "svelte-vkfdfd");
    			add_location(button2, file$1, 16, 2, 247);
    			attr_dev(button3, "class", "svelte-vkfdfd");
    			add_location(button3, file$1, 17, 2, 274);
    			attr_dev(button4, "class", "svelte-vkfdfd");
    			add_location(button4, file$1, 18, 2, 301);
    			attr_dev(button5, "class", "svelte-vkfdfd");
    			add_location(button5, file$1, 19, 2, 328);
    			attr_dev(button6, "class", "svelte-vkfdfd");
    			add_location(button6, file$1, 20, 2, 355);
    			attr_dev(button7, "class", "svelte-vkfdfd");
    			add_location(button7, file$1, 21, 2, 383);
    			attr_dev(button8, "class", "svelte-vkfdfd");
    			add_location(button8, file$1, 22, 2, 412);
    			attr_dev(footer, "class", "svelte-vkfdfd");
    			add_location(footer, file$1, 13, 0, 182);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, button0);
    			append_dev(footer, t1);
    			append_dev(footer, button1);
    			append_dev(footer, t3);
    			append_dev(footer, button2);
    			append_dev(footer, t5);
    			append_dev(footer, button3);
    			append_dev(footer, t7);
    			append_dev(footer, button4);
    			append_dev(footer, t9);
    			append_dev(footer, button5);
    			append_dev(footer, t11);
    			append_dev(footer, button6);
    			append_dev(footer, t13);
    			append_dev(footer, button7);
    			append_dev(footer, t15);
    			append_dev(footer, button8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$1, "keydown", /*handleKey*/ ctx[1], false, false, false),
    					listen_dev(button8, "click", /*quitCommand*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);

    	let quitCommand = e => {
    		window.close();
    	};

    	let handleKey = e => {
    		if (e.key === "F10") {
    			e.preventDefault();
    			quitCommand();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ quitCommand, handleKey });

    	$$self.$inject_state = $$props => {
    		if ('quitCommand' in $$props) $$invalidate(0, quitCommand = $$props.quitCommand);
    		if ('handleKey' in $$props) $$invalidate(1, handleKey = $$props.handleKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [quitCommand, handleKey];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */

    const { window: window_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let header;
    	let t1;
    	let panel0;
    	let t2;
    	let panel1;
    	let t3;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;

    	panel0 = new Panel({
    			props: {
    				initialDirectory: /*directoryLeft*/ ctx[1],
    				position: "left",
    				active: /*activePanel*/ ctx[0] === "left",
    				onActivate: /*func*/ ctx[4]
    			},
    			$$inline: true
    		});

    	panel1 = new Panel({
    			props: {
    				initialDirectory: /*directoryRight*/ ctx[2],
    				position: "right",
    				active: /*activePanel*/ ctx[0] === "right",
    				onActivate: /*func_1*/ ctx[5]
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			header = element("header");
    			header.textContent = "File Manager";
    			t1 = space();
    			create_component(panel0.$$.fragment);
    			t2 = space();
    			create_component(panel1.$$.fragment);
    			t3 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(header, "class", "svelte-16jez2u");
    			add_location(header, file, 20, 2, 473);
    			attr_dev(div, "class", "ui svelte-16jez2u");
    			add_location(div, file, 19, 0, 454);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, header);
    			append_dev(div, t1);
    			mount_component(panel0, div, null);
    			append_dev(div, t2);
    			mount_component(panel1, div, null);
    			append_dev(div, t3);
    			mount_component(footer, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKey*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const panel0_changes = {};
    			if (dirty & /*activePanel*/ 1) panel0_changes.active = /*activePanel*/ ctx[0] === "left";
    			if (dirty & /*activePanel*/ 1) panel0_changes.onActivate = /*func*/ ctx[4];
    			panel0.$set(panel0_changes);
    			const panel1_changes = {};
    			if (dirty & /*activePanel*/ 1) panel1_changes.active = /*activePanel*/ ctx[0] === "right";
    			if (dirty & /*activePanel*/ 1) panel1_changes.onActivate = /*func_1*/ ctx[5];
    			panel1.$set(panel1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel0.$$.fragment, local);
    			transition_in(panel1.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel0.$$.fragment, local);
    			transition_out(panel1.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(panel0);
    			destroy_component(panel1);
    			destroy_component(footer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let activePanel = "left";
    	let directoryLeft = window.api.currentDirectory();
    	let directoryRight = window.api.currentDirectory() + "/node_modules";

    	let handleKey = e => {
    		if (e.key === "Tab") {
    			if (activePanel === "left") {
    				$$invalidate(0, activePanel = "right");
    			} else {
    				$$invalidate(0, activePanel = "left");
    			}

    			e.preventDefault();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(0, activePanel = "left");
    	const func_1 = () => $$invalidate(0, activePanel = "right");

    	$$self.$capture_state = () => ({
    		Panel,
    		Footer,
    		activePanel,
    		directoryLeft,
    		directoryRight,
    		handleKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('activePanel' in $$props) $$invalidate(0, activePanel = $$props.activePanel);
    		if ('directoryLeft' in $$props) $$invalidate(1, directoryLeft = $$props.directoryLeft);
    		if ('directoryRight' in $$props) $$invalidate(2, directoryRight = $$props.directoryRight);
    		if ('handleKey' in $$props) $$invalidate(3, handleKey = $$props.handleKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activePanel, directoryLeft, directoryRight, handleKey, func, func_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    let app = new App({target: document.body});

    return app;

}());
//# sourceMappingURL=bundle.js.map
