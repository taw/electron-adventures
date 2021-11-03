
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    /* src/Arc.svelte generated by Svelte v3.42.1 */

    const file$3 = "src/Arc.svelte";

    function create_fragment$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", /*d*/ ctx[0]);
    			attr_dev(path, "class", "svelte-jaanol");
    			add_location(path, file$3, 18, 0, 422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arc', slots, []);
    	let { cx = 0, cy = 0, r, a0, a1 } = $$props;
    	let x0 = cx + Math.sin(a0 * 2 * Math.PI / 360.0) * r;
    	let y0 = cy + Math.cos(a0 * 2 * Math.PI / 360.0) * r;
    	let x1 = cx + Math.sin(a1 * 2 * Math.PI / 360.0) * r;
    	let y1 = cy + Math.cos(a1 * 2 * Math.PI / 360.0) * r;
    	let arcSweep = a1 - a0 <= 180 ? 0 : 1;

    	let d = `
    M ${cx} ${cy}
    L ${x0} ${y0}
    A ${r} ${r} 0 ${arcSweep} 0 ${x1} ${y1}
    Z
  `;

    	const writable_props = ['cx', 'cy', 'r', 'a0', 'a1'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arc> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cx' in $$props) $$invalidate(1, cx = $$props.cx);
    		if ('cy' in $$props) $$invalidate(2, cy = $$props.cy);
    		if ('r' in $$props) $$invalidate(3, r = $$props.r);
    		if ('a0' in $$props) $$invalidate(4, a0 = $$props.a0);
    		if ('a1' in $$props) $$invalidate(5, a1 = $$props.a1);
    	};

    	$$self.$capture_state = () => ({
    		cx,
    		cy,
    		r,
    		a0,
    		a1,
    		x0,
    		y0,
    		x1,
    		y1,
    		arcSweep,
    		d
    	});

    	$$self.$inject_state = $$props => {
    		if ('cx' in $$props) $$invalidate(1, cx = $$props.cx);
    		if ('cy' in $$props) $$invalidate(2, cy = $$props.cy);
    		if ('r' in $$props) $$invalidate(3, r = $$props.r);
    		if ('a0' in $$props) $$invalidate(4, a0 = $$props.a0);
    		if ('a1' in $$props) $$invalidate(5, a1 = $$props.a1);
    		if ('x0' in $$props) x0 = $$props.x0;
    		if ('y0' in $$props) y0 = $$props.y0;
    		if ('x1' in $$props) x1 = $$props.x1;
    		if ('y1' in $$props) y1 = $$props.y1;
    		if ('arcSweep' in $$props) arcSweep = $$props.arcSweep;
    		if ('d' in $$props) $$invalidate(0, d = $$props.d);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [d, cx, cy, r, a0, a1];
    }

    class Arc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { cx: 1, cy: 2, r: 3, a0: 4, a1: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arc",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*r*/ ctx[3] === undefined && !('r' in props)) {
    			console.warn("<Arc> was created without expected prop 'r'");
    		}

    		if (/*a0*/ ctx[4] === undefined && !('a0' in props)) {
    			console.warn("<Arc> was created without expected prop 'a0'");
    		}

    		if (/*a1*/ ctx[5] === undefined && !('a1' in props)) {
    			console.warn("<Arc> was created without expected prop 'a1'");
    		}
    	}

    	get cx() {
    		throw new Error("<Arc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cx(value) {
    		throw new Error("<Arc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cy() {
    		throw new Error("<Arc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cy(value) {
    		throw new Error("<Arc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<Arc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<Arc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a0() {
    		throw new Error("<Arc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a0(value) {
    		throw new Error("<Arc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a1() {
    		throw new Error("<Arc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a1(value) {
    		throw new Error("<Arc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ArcLabel.svelte generated by Svelte v3.42.1 */

    const file$2 = "src/ArcLabel.svelte";

    function create_fragment$2(ctx) {
    	let g;
    	let text_1;
    	let t;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			text_1 = svg_element("text");
    			t = text(/*text*/ ctx[1]);
    			attr_dev(text_1, "x", 0);
    			attr_dev(text_1, "y", 0);
    			attr_dev(text_1, "text-anchor", "middle");
    			attr_dev(text_1, "class", "svelte-1lxysg1");
    			add_location(text_1, file$2, 8, 2, 221);
    			attr_dev(g, "transform", g_transform_value = `translate(${/*x*/ ctx[2]},${/*y*/ ctx[3]}) rotate(${180 - /*a*/ ctx[0]})`);
    			add_location(g, file$2, 7, 0, 163);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);

    			if (dirty & /*a*/ 1 && g_transform_value !== (g_transform_value = `translate(${/*x*/ ctx[2]},${/*y*/ ctx[3]}) rotate(${180 - /*a*/ ctx[0]})`)) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArcLabel', slots, []);
    	let { cx = 0, cy = 0, r, a, text } = $$props;
    	let x = cx + Math.sin(a * 2 * Math.PI / 360.0) * r;
    	let y = cy + Math.cos(a * 2 * Math.PI / 360.0) * r;
    	const writable_props = ['cx', 'cy', 'r', 'a', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArcLabel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cx' in $$props) $$invalidate(4, cx = $$props.cx);
    		if ('cy' in $$props) $$invalidate(5, cy = $$props.cy);
    		if ('r' in $$props) $$invalidate(6, r = $$props.r);
    		if ('a' in $$props) $$invalidate(0, a = $$props.a);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ cx, cy, r, a, text, x, y });

    	$$self.$inject_state = $$props => {
    		if ('cx' in $$props) $$invalidate(4, cx = $$props.cx);
    		if ('cy' in $$props) $$invalidate(5, cy = $$props.cy);
    		if ('r' in $$props) $$invalidate(6, r = $$props.r);
    		if ('a' in $$props) $$invalidate(0, a = $$props.a);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [a, text, x, y, cx, cy, r];
    }

    class ArcLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { cx: 4, cy: 5, r: 6, a: 0, text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArcLabel",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*r*/ ctx[6] === undefined && !('r' in props)) {
    			console.warn("<ArcLabel> was created without expected prop 'r'");
    		}

    		if (/*a*/ ctx[0] === undefined && !('a' in props)) {
    			console.warn("<ArcLabel> was created without expected prop 'a'");
    		}

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<ArcLabel> was created without expected prop 'text'");
    		}
    	}

    	get cx() {
    		throw new Error("<ArcLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cx(value) {
    		throw new Error("<ArcLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cy() {
    		throw new Error("<ArcLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cy(value) {
    		throw new Error("<ArcLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<ArcLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<ArcLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a() {
    		throw new Error("<ArcLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a(value) {
    		throw new Error("<ArcLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<ArcLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<ArcLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/RouletteWheel.svelte generated by Svelte v3.42.1 */
    const file$1 = "src/RouletteWheel.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (42:2) {#each options as opt, i}
    function create_each_block_1(ctx) {
    	let arc;
    	let current;

    	arc = new Arc({
    			props: {
    				r: /*r*/ ctx[1],
    				a0: /*sliceSize*/ ctx[3] * /*i*/ ctx[11],
    				a1: /*sliceSize*/ ctx[3] * (/*i*/ ctx[11] + 1)
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(arc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(arc, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const arc_changes = {};
    			if (dirty & /*r*/ 2) arc_changes.r = /*r*/ ctx[1];
    			arc.$set(arc_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(arc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(42:2) {#each options as opt, i}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#each options as opt, i}
    function create_each_block(ctx) {
    	let arclabel;
    	let current;

    	arclabel = new ArcLabel({
    			props: {
    				r: /*r*/ ctx[1] * 2.0 / 3.0,
    				a: /*sliceSize*/ ctx[3] * (/*i*/ ctx[11] + 0.5),
    				text: /*opt*/ ctx[9]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(arclabel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(arclabel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const arclabel_changes = {};
    			if (dirty & /*r*/ 2) arclabel_changes.r = /*r*/ ctx[1] * 2.0 / 3.0;
    			if (dirty & /*options*/ 1) arclabel_changes.text = /*opt*/ ctx[9];
    			arclabel.$set(arclabel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arclabel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arclabel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(arclabel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(45:2) {#each options as opt, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let g;
    	let each0_anchor;
    	let g_transform_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*options*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*options*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "transform", g_transform_value = `rotate(${/*angle*/ ctx[2]})`);
    			attr_dev(g, "class", "svelte-17py5wt");
    			add_location(g, file$1, 40, 0, 876);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g, null);
    			}

    			append_dev(g, each0_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(g, "click", /*click*/ ctx[4], false, false, false),
    					listen_dev(g, "transitionend", /*transitionend*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*r, sliceSize, options*/ 11) {
    				each_value_1 = /*options*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(g, each0_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*r, sliceSize, options*/ 11) {
    				each_value = /*options*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*angle*/ 4 && g_transform_value !== (g_transform_value = `rotate(${/*angle*/ ctx[2]})`)) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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

    function randint(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randfloat(min, max) {
    	return Math.random() * (max - min) + min;
    }

    function roundUp(x, z) {
    	return Math.ceil(x / z) * z;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RouletteWheel', slots, []);
    	let { options } = $$props;
    	let { r } = $$props;
    	let { onRolled } = $$props;
    	let sliceCount = options.length;
    	let sliceSize = 360 / sliceCount;
    	let angle = sliceSize / 2;
    	let rolledOption;

    	function click() {
    		let roll = randint(0, sliceCount - 1);
    		let rollPlace = randfloat(0.2 * sliceSize, 0.8 * sliceSize);
    		let finalAngle = roll * sliceSize + rollPlace;
    		let spins = randint(2, 3);
    		$$invalidate(2, angle = roundUp(angle, 360) + spins * 360 + finalAngle);
    		rolledOption = options[roll];
    	}

    	function transitionend() {
    		onRolled(rolledOption);
    	}

    	const writable_props = ['options', 'r', 'onRolled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RouletteWheel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    		if ('r' in $$props) $$invalidate(1, r = $$props.r);
    		if ('onRolled' in $$props) $$invalidate(6, onRolled = $$props.onRolled);
    	};

    	$$self.$capture_state = () => ({
    		Arc,
    		ArcLabel,
    		options,
    		r,
    		onRolled,
    		sliceCount,
    		sliceSize,
    		angle,
    		rolledOption,
    		randint,
    		randfloat,
    		roundUp,
    		click,
    		transitionend
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    		if ('r' in $$props) $$invalidate(1, r = $$props.r);
    		if ('onRolled' in $$props) $$invalidate(6, onRolled = $$props.onRolled);
    		if ('sliceCount' in $$props) sliceCount = $$props.sliceCount;
    		if ('sliceSize' in $$props) $$invalidate(3, sliceSize = $$props.sliceSize);
    		if ('angle' in $$props) $$invalidate(2, angle = $$props.angle);
    		if ('rolledOption' in $$props) rolledOption = $$props.rolledOption;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options, r, angle, sliceSize, click, transitionend, onRolled];
    }

    class RouletteWheel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { options: 0, r: 1, onRolled: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouletteWheel",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[0] === undefined && !('options' in props)) {
    			console.warn("<RouletteWheel> was created without expected prop 'options'");
    		}

    		if (/*r*/ ctx[1] === undefined && !('r' in props)) {
    			console.warn("<RouletteWheel> was created without expected prop 'r'");
    		}

    		if (/*onRolled*/ ctx[6] === undefined && !('onRolled' in props)) {
    			console.warn("<RouletteWheel> was created without expected prop 'onRolled'");
    		}
    	}

    	get options() {
    		throw new Error("<RouletteWheel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<RouletteWheel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<RouletteWheel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<RouletteWheel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onRolled() {
    		throw new Error("<RouletteWheel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onRolled(value) {
    		throw new Error("<RouletteWheel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let svg;
    	let g;
    	let roulettewheel;
    	let polygon;
    	let current;

    	roulettewheel = new RouletteWheel({
    			props: {
    				r: 150,
    				options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    				onRolled
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			create_component(roulettewheel.$$.fragment);
    			polygon = svg_element("polygon");
    			attr_dev(g, "transform", "translate(200,200)");
    			add_location(g, file, 10, 4, 169);
    			attr_dev(polygon, "points", "200 360 210 370 190 370");
    			attr_dev(polygon, "class", "svelte-d2ht0c");
    			add_location(polygon, file, 17, 4, 338);
    			attr_dev(svg, "height", "400");
    			attr_dev(svg, "width", "400");
    			attr_dev(svg, "class", "svelte-d2ht0c");
    			add_location(svg, file, 9, 2, 134);
    			add_location(div, file, 8, 0, 126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);
    			mount_component(roulettewheel, g, null);
    			append_dev(svg, polygon);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(roulettewheel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(roulettewheel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(roulettewheel);
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

    function onRolled(opt) {
    	console.log(opt);
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ RouletteWheel, onRolled });
    	return [];
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
