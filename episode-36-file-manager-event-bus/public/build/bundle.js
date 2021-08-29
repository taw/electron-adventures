
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
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

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src/File.svelte generated by Svelte v3.42.1 */
    const file_1 = "src/File.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let t0_value = filySymbol(/*file*/ ctx[1]) + "";
    	let t0;
    	let t1_value = /*file*/ ctx[1].name + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(t1_value);
    			attr_dev(div, "class", "file svelte-r2d4f0");
    			toggle_class(div, "focused", /*focused*/ ctx[2]);
    			toggle_class(div, "selected", /*selected*/ ctx[3]);
    			add_location(div, file_1, 45, 0, 1034);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			/*div_binding*/ ctx[12](div);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", prevent_default(/*click_handler*/ ctx[9]), false, true, false),
    					listen_dev(div, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[10]), false, true, false),
    					listen_dev(div, "dblclick", prevent_default(/*dblclick_handler*/ ctx[11]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*file*/ 2 && t0_value !== (t0_value = filySymbol(/*file*/ ctx[1]) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*file*/ 2 && t1_value !== (t1_value = /*file*/ ctx[1].name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*focused*/ 4) {
    				toggle_class(div, "focused", /*focused*/ ctx[2]);
    			}

    			if (dirty & /*selected*/ 8) {
    				toggle_class(div, "selected", /*selected*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function filySymbol(file) {
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
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('File', slots, []);
    	let { file } = $$props;
    	let { idx } = $$props;
    	let { panelId } = $$props;
    	let { focused } = $$props;
    	let { selected } = $$props;
    	let { node = undefined } = $$props;
    	let { eventBus } = getContext("app");

    	function onclick() {
    		eventBus.emit("app", "activatePanel", panelId);
    		eventBus.emit(panelId, "focusOn", idx);
    	}

    	function onrightclick() {
    		eventBus.emit("app", "activatePanel", panelId);
    		eventBus.emit(panelId, "focusOn", idx);
    		eventBus.emit(panelId, "flipSelected", idx);
    	}

    	function ondoubleclick() {
    		eventBus.emit("app", "activatePanel", panelId);
    		eventBus.emit(panelId, "focusOn", idx);
    		eventBus.emit(panelId, "activateItem");
    	}

    	const writable_props = ['file', 'idx', 'panelId', 'focused', 'selected', 'node'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<File> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => onclick();
    	const contextmenu_handler = () => onrightclick();
    	const dblclick_handler = () => ondoubleclick();

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			node = $$value;
    			$$invalidate(0, node);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(1, file = $$props.file);
    		if ('idx' in $$props) $$invalidate(7, idx = $$props.idx);
    		if ('panelId' in $$props) $$invalidate(8, panelId = $$props.panelId);
    		if ('focused' in $$props) $$invalidate(2, focused = $$props.focused);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		file,
    		idx,
    		panelId,
    		focused,
    		selected,
    		node,
    		eventBus,
    		onclick,
    		onrightclick,
    		ondoubleclick,
    		filySymbol
    	});

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(1, file = $$props.file);
    		if ('idx' in $$props) $$invalidate(7, idx = $$props.idx);
    		if ('panelId' in $$props) $$invalidate(8, panelId = $$props.panelId);
    		if ('focused' in $$props) $$invalidate(2, focused = $$props.focused);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    		if ('eventBus' in $$props) eventBus = $$props.eventBus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		node,
    		file,
    		focused,
    		selected,
    		onclick,
    		onrightclick,
    		ondoubleclick,
    		idx,
    		panelId,
    		click_handler,
    		contextmenu_handler,
    		dblclick_handler,
    		div_binding
    	];
    }

    class File extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			file: 1,
    			idx: 7,
    			panelId: 8,
    			focused: 2,
    			selected: 3,
    			node: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "File",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[1] === undefined && !('file' in props)) {
    			console.warn("<File> was created without expected prop 'file'");
    		}

    		if (/*idx*/ ctx[7] === undefined && !('idx' in props)) {
    			console.warn("<File> was created without expected prop 'idx'");
    		}

    		if (/*panelId*/ ctx[8] === undefined && !('panelId' in props)) {
    			console.warn("<File> was created without expected prop 'panelId'");
    		}

    		if (/*focused*/ ctx[2] === undefined && !('focused' in props)) {
    			console.warn("<File> was created without expected prop 'focused'");
    		}

    		if (/*selected*/ ctx[3] === undefined && !('selected' in props)) {
    			console.warn("<File> was created without expected prop 'selected'");
    		}
    	}

    	get file() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get idx() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idx(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get panelId() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set panelId(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focused() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focused(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get node() {
    		throw new Error("<File>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<File>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Panel.svelte generated by Svelte v3.42.1 */
    const file$2 = "src/Panel.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	child_ctx[32] = list;
    	child_ctx[33] = i;
    	return child_ctx;
    }

    // (112:4) {#each files as file, idx}
    function create_each_block(ctx) {
    	let file_1;
    	let updating_node;
    	let current;

    	function file_1_node_binding(value) {
    		/*file_1_node_binding*/ ctx[12](value, /*idx*/ ctx[33]);
    	}

    	let file_1_props = {
    		panelId: /*id*/ ctx[0],
    		file: /*file*/ ctx[31],
    		idx: /*idx*/ ctx[33],
    		focused: /*idx*/ ctx[33] === /*focusedIdx*/ ctx[3],
    		selected: /*selected*/ ctx[4].includes(/*idx*/ ctx[33])
    	};

    	if (/*fileNodes*/ ctx[5][/*idx*/ ctx[33]] !== void 0) {
    		file_1_props.node = /*fileNodes*/ ctx[5][/*idx*/ ctx[33]];
    	}

    	file_1 = new File({ props: file_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(file_1, 'node', file_1_node_binding));

    	const block = {
    		c: function create() {
    			create_component(file_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(file_1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const file_1_changes = {};
    			if (dirty[0] & /*id*/ 1) file_1_changes.panelId = /*id*/ ctx[0];
    			if (dirty[0] & /*files*/ 4) file_1_changes.file = /*file*/ ctx[31];
    			if (dirty[0] & /*focusedIdx*/ 8) file_1_changes.focused = /*idx*/ ctx[33] === /*focusedIdx*/ ctx[3];
    			if (dirty[0] & /*selected*/ 16) file_1_changes.selected = /*selected*/ ctx[4].includes(/*idx*/ ctx[33]);

    			if (!updating_node && dirty[0] & /*fileNodes*/ 32) {
    				updating_node = true;
    				file_1_changes.node = /*fileNodes*/ ctx[5][/*idx*/ ctx[33]];
    				add_flush_callback(() => updating_node = false);
    			}

    			file_1.$set(file_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(file_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(file_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(file_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(112:4) {#each files as file, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let header;
    	let t0_value = /*directory*/ ctx[1].split("/").slice(-1)[0] + "";
    	let t0;
    	let t1;
    	let div0;
    	let div1_class_value;
    	let current;
    	let each_value = /*files*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

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

    			attr_dev(header, "class", "svelte-1aqzmie");
    			add_location(header, file$2, 109, 2, 2677);
    			attr_dev(div0, "class", "file-list svelte-1aqzmie");
    			add_location(div0, file$2, 110, 2, 2732);
    			attr_dev(div1, "class", div1_class_value = "panel " + /*id*/ ctx[0] + " svelte-1aqzmie");
    			toggle_class(div1, "active", /*active*/ ctx[7]);
    			add_location(div1, file$2, 108, 0, 2628);
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

    			/*div0_binding*/ ctx[13](div0);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*directory*/ 2) && t0_value !== (t0_value = /*directory*/ ctx[1].split("/").slice(-1)[0] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*id, files, focusedIdx, selected, fileNodes*/ 61) {
    				each_value = /*files*/ ctx[2];
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
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*id*/ 1 && div1_class_value !== (div1_class_value = "panel " + /*id*/ ctx[0] + " svelte-1aqzmie")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*id, active*/ 129) {
    				toggle_class(div1, "active", /*active*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			/*div0_binding*/ ctx[13](null);
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
    	let active;
    	let filesPromise;
    	let filesCount;
    	let focused;
    	let $activePanel;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Panel', slots, []);
    	let { initialDirectory } = $$props;
    	let { id } = $$props;
    	let directory = initialDirectory;
    	let initialFocus;
    	let files = [];
    	let selected = [];
    	let focusedIdx = 0;
    	let fileNodes = [];
    	let fileListNode;
    	let { eventBus, activePanel } = getContext("app");
    	validate_store(activePanel, 'activePanel');
    	component_subscribe($$self, activePanel, value => $$invalidate(11, $activePanel = value));

    	let flipSelected = idx => {
    		if (selected.includes(idx)) {
    			$$invalidate(4, selected = selected.filter(f => f !== idx));
    		} else {
    			$$invalidate(4, selected = [...selected, idx]);
    		}
    	};

    	let setInitialFocus = async () => {
    		$$invalidate(3, focusedIdx = 0);

    		if (initialFocus) {
    			$$invalidate(3, focusedIdx = files.findIndex(x => x.name === initialFocus));

    			if (focusedIdx === -1) {
    				$$invalidate(3, focusedIdx = 0);
    			}
    		} else {
    			$$invalidate(3, focusedIdx = 0);
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
    		$$invalidate(3, focusedIdx = idx);

    		if (focusedIdx > filesCount - 1) {
    			$$invalidate(3, focusedIdx = filesCount - 1);
    		}

    		if (focusedIdx < 0) {
    			$$invalidate(3, focusedIdx = 0);
    		}

    		scrollFocusedIntoView();
    	};

    	function pageSize() {
    		if (!fileNodes[0] || !fileNodes[1] || !fileListNode) {
    			return 16;
    		}

    		let y0 = fileNodes[0].getBoundingClientRect().y;
    		let y1 = fileNodes[1].getBoundingClientRect().y;
    		let yh = fileListNode.getBoundingClientRect().height;
    		return Math.floor(yh / (y1 - y0));
    	}

    	function activateItem() {
    		if (focused?.type === "directory") {
    			if (focused.name === "..") {
    				initialFocus = directory.split("/").slice(-1)[0];
    				$$invalidate(1, directory = directory.split("/").slice(0, -1).join("/") || "/");
    			} else {
    				initialFocus = null;
    				$$invalidate(1, directory += "/" + focused.name);
    			}
    		}
    	}

    	function nextItem() {
    		focusOn(focusedIdx + 1);
    	}

    	function previousItem() {
    		focusOn(focusedIdx - 1);
    	}

    	function pageDown() {
    		focusOn(focusedIdx + pageSize());
    	}

    	function pageUp() {
    		focusOn(focusedIdx - pageSize());
    	}

    	function firstItem() {
    		focusOn(0);
    	}

    	function lastItem() {
    		focusOn(filesCount - 1);
    	}

    	function flipItem() {
    		flipSelected(focusedIdx);
    		nextItem();
    	}

    	eventBus.handle(id, {
    		nextItem,
    		previousItem,
    		pageDown,
    		pageUp,
    		firstItem,
    		lastItem,
    		flipItem,
    		activateItem,
    		focusOn,
    		flipSelected,
    		activateItem
    	});

    	const writable_props = ['initialDirectory', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Panel> was created with unknown prop '${key}'`);
    	});

    	function file_1_node_binding(value, idx) {
    		if ($$self.$$.not_equal(fileNodes[idx], value)) {
    			fileNodes[idx] = value;
    			$$invalidate(5, fileNodes);
    		}
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileListNode = $$value;
    			$$invalidate(6, fileListNode);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('initialDirectory' in $$props) $$invalidate(9, initialDirectory = $$props.initialDirectory);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		File,
    		getContext,
    		tick,
    		initialDirectory,
    		id,
    		directory,
    		initialFocus,
    		files,
    		selected,
    		focusedIdx,
    		fileNodes,
    		fileListNode,
    		eventBus,
    		activePanel,
    		flipSelected,
    		setInitialFocus,
    		scrollFocusedIntoView,
    		focusOn,
    		pageSize,
    		activateItem,
    		nextItem,
    		previousItem,
    		pageDown,
    		pageUp,
    		firstItem,
    		lastItem,
    		flipItem,
    		filesCount,
    		focused,
    		filesPromise,
    		active,
    		$activePanel
    	});

    	$$self.$inject_state = $$props => {
    		if ('initialDirectory' in $$props) $$invalidate(9, initialDirectory = $$props.initialDirectory);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('directory' in $$props) $$invalidate(1, directory = $$props.directory);
    		if ('initialFocus' in $$props) initialFocus = $$props.initialFocus;
    		if ('files' in $$props) $$invalidate(2, files = $$props.files);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('focusedIdx' in $$props) $$invalidate(3, focusedIdx = $$props.focusedIdx);
    		if ('fileNodes' in $$props) $$invalidate(5, fileNodes = $$props.fileNodes);
    		if ('fileListNode' in $$props) $$invalidate(6, fileListNode = $$props.fileListNode);
    		if ('eventBus' in $$props) eventBus = $$props.eventBus;
    		if ('activePanel' in $$props) $$invalidate(8, activePanel = $$props.activePanel);
    		if ('flipSelected' in $$props) flipSelected = $$props.flipSelected;
    		if ('setInitialFocus' in $$props) $$invalidate(19, setInitialFocus = $$props.setInitialFocus);
    		if ('scrollFocusedIntoView' in $$props) scrollFocusedIntoView = $$props.scrollFocusedIntoView;
    		if ('focusOn' in $$props) focusOn = $$props.focusOn;
    		if ('filesCount' in $$props) filesCount = $$props.filesCount;
    		if ('focused' in $$props) focused = $$props.focused;
    		if ('filesPromise' in $$props) $$invalidate(10, filesPromise = $$props.filesPromise);
    		if ('active' in $$props) $$invalidate(7, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$activePanel, id*/ 2049) {
    			$$invalidate(7, active = $activePanel === id);
    		}

    		if ($$self.$$.dirty[0] & /*directory*/ 2) {
    			$$invalidate(10, filesPromise = window.api.directoryContents(directory));
    		}

    		if ($$self.$$.dirty[0] & /*filesPromise*/ 1024) {
    			filesPromise.then(x => {
    				$$invalidate(2, files = x);
    				$$invalidate(4, selected = []);
    				setInitialFocus();
    			});
    		}

    		if ($$self.$$.dirty[0] & /*files*/ 4) {
    			filesCount = files.length;
    		}

    		if ($$self.$$.dirty[0] & /*files, focusedIdx*/ 12) {
    			focused = files[focusedIdx];
    		}
    	};

    	return [
    		id,
    		directory,
    		files,
    		focusedIdx,
    		selected,
    		fileNodes,
    		fileListNode,
    		active,
    		activePanel,
    		initialDirectory,
    		filesPromise,
    		$activePanel,
    		file_1_node_binding,
    		div0_binding
    	];
    }

    class Panel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { initialDirectory: 9, id: 0 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Panel",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*initialDirectory*/ ctx[9] === undefined && !('initialDirectory' in props)) {
    			console.warn("<Panel> was created without expected prop 'initialDirectory'");
    		}

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Panel> was created without expected prop 'id'");
    		}
    	}

    	get initialDirectory() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialDirectory(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Panel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Panel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.42.1 */
    const file$1 = "src/Footer.svelte";

    function create_fragment$2(ctx) {
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
    			add_location(button0, file$1, 6, 2, 108);
    			attr_dev(button1, "class", "svelte-vkfdfd");
    			add_location(button1, file$1, 7, 2, 135);
    			attr_dev(button2, "class", "svelte-vkfdfd");
    			add_location(button2, file$1, 8, 2, 162);
    			attr_dev(button3, "class", "svelte-vkfdfd");
    			add_location(button3, file$1, 9, 2, 189);
    			attr_dev(button4, "class", "svelte-vkfdfd");
    			add_location(button4, file$1, 10, 2, 216);
    			attr_dev(button5, "class", "svelte-vkfdfd");
    			add_location(button5, file$1, 11, 2, 243);
    			attr_dev(button6, "class", "svelte-vkfdfd");
    			add_location(button6, file$1, 12, 2, 270);
    			attr_dev(button7, "class", "svelte-vkfdfd");
    			add_location(button7, file$1, 13, 2, 298);
    			attr_dev(button8, "class", "svelte-vkfdfd");
    			add_location(button8, file$1, 14, 2, 327);
    			attr_dev(footer, "class", "svelte-vkfdfd");
    			add_location(footer, file$1, 5, 0, 97);
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
    				dispose = listen_dev(button8, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let { eventBus } = getContext("app");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => eventBus.emit("app", "quit");
    	$$self.$capture_state = () => ({ getContext, eventBus });

    	$$self.$inject_state = $$props => {
    		if ('eventBus' in $$props) $$invalidate(0, eventBus = $$props.eventBus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [eventBus, click_handler];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    class EventBus {
      constructor() {
        this.callbacks = {};
      }

      handle(target, map) {
        this.callbacks[target] = { ...(this.callbacks[target] || {}), ...map };
      }

      emit(target, event, ...details) {
        let handlers = this.callbacks[target];
        if (handlers) {
          if (handlers[event]) {
            handlers[event](...details);
          } else if (handlers["*"]) {
            handlers["*"](event, ...details);
          }
        }
      }
    }

    var commands = [
      {key: "Tab", action: ["app", "switchPanel"]},
      {key: "F10", action: ["app", "quit"]},
      {key: "ArrowDown", action: ["activePanel", "nextItem"]},
      {key: "ArrowUp", action: ["activePanel", "previousItem"]},
      {key: "PageDown", action: ["activePanel", "pageDown"]},
      {key: "PageUp", action: ["activePanel", "pageUp"]},
      {key: "Home", action: ["activePanel", "firstItem"]},
      {key: "End", action: ["activePanel", "lastItem"]},
      {key: " ", action: ["activePanel", "flipItem"]},
      {key: "Enter", action: ["activePanel", "activateItem"]},
    ];

    /* src/Keyboard.svelte generated by Svelte v3.42.1 */

    function create_fragment$1(ctx) {
    	let mounted;
    	let dispose;

    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleKey*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			mounted = false;
    			dispose();
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
    	validate_slots('Keyboard', slots, []);
    	let { eventBus } = getContext("app");

    	function handleKey(e) {
    		for (let command of commands) {
    			if (command.key === e.key) {
    				e.preventDefault();
    				eventBus.emit(...command.action);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Keyboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		commands,
    		getContext,
    		eventBus,
    		handleKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventBus' in $$props) eventBus = $$props.eventBus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handleKey];
    }

    class Keyboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Keyboard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */
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
    	let t4;
    	let keyboard;
    	let current;

    	panel0 = new Panel({
    			props: {
    				initialDirectory: /*initialDirectoryLeft*/ ctx[1],
    				id: "left"
    			},
    			$$inline: true
    		});

    	panel1 = new Panel({
    			props: {
    				initialDirectory: /*initialDirectoryRight*/ ctx[2],
    				id: "right"
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });
    	keyboard = new Keyboard({ $$inline: true });

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
    			t4 = space();
    			create_component(keyboard.$$.fragment);
    			attr_dev(header, "class", "svelte-16jez2u");
    			add_location(header, file, 37, 2, 991);
    			attr_dev(div, "class", "ui svelte-16jez2u");
    			add_location(div, file, 36, 0, 972);
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
    			insert_dev(target, t4, anchor);
    			mount_component(keyboard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel0.$$.fragment, local);
    			transition_in(panel1.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(keyboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel0.$$.fragment, local);
    			transition_out(panel1.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(keyboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(panel0);
    			destroy_component(panel1);
    			destroy_component(footer);
    			if (detaching) detach_dev(t4);
    			destroy_component(keyboard, detaching);
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

    function quit() {
    	window.close();
    }

    function instance($$self, $$props, $$invalidate) {
    	let $activePanel;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let eventBus = new EventBus();
    	let activePanel = writable("left");
    	validate_store(activePanel, 'activePanel');
    	component_subscribe($$self, activePanel, value => $$invalidate(3, $activePanel = value));
    	setContext("app", { eventBus, activePanel });
    	let initialDirectoryLeft = window.api.currentDirectory();
    	let initialDirectoryRight = window.api.currentDirectory() + "/node_modules";

    	function switchPanel() {
    		if ($activePanel === "left") {
    			activePanel.set("right");
    		} else {
    			activePanel.set("left");
    		}
    	}

    	function activatePanel(panel) {
    		activePanel.set(panel);
    	}

    	function emitToActivePanel(...args) {
    		eventBus.emit($activePanel, ...args);
    	}

    	eventBus.handle("app", { switchPanel, activatePanel, quit });
    	eventBus.handle("activePanel", { "*": emitToActivePanel });
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		writable,
    		setContext,
    		Panel,
    		Footer,
    		EventBus,
    		Keyboard,
    		eventBus,
    		activePanel,
    		initialDirectoryLeft,
    		initialDirectoryRight,
    		switchPanel,
    		activatePanel,
    		quit,
    		emitToActivePanel,
    		$activePanel
    	});

    	$$self.$inject_state = $$props => {
    		if ('eventBus' in $$props) eventBus = $$props.eventBus;
    		if ('activePanel' in $$props) $$invalidate(0, activePanel = $$props.activePanel);
    		if ('initialDirectoryLeft' in $$props) $$invalidate(1, initialDirectoryLeft = $$props.initialDirectoryLeft);
    		if ('initialDirectoryRight' in $$props) $$invalidate(2, initialDirectoryRight = $$props.initialDirectoryRight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activePanel, initialDirectoryLeft, initialDirectoryRight];
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
