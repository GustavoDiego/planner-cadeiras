var wm = Object.defineProperty,
  mm = Object.defineProperties;
var km = Object.getOwnPropertyDescriptors;
var Jp = Object.getOwnPropertySymbols;
var ym = Object.prototype.hasOwnProperty,
  _m = Object.prototype.propertyIsEnumerable;
var e0 = (e, t, n) =>
    t in e ? wm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n),
  w = (e, t) => {
    for (var n in (t ||= {})) ym.call(t, n) && e0(e, n, t[n]);
    if (Jp) for (var n of Jp(t)) _m.call(t, n) && e0(e, n, t[n]);
    return e;
  },
  F = (e, t) => mm(e, km(t));
var Mc;
function ks() {
  return Mc;
}
function jt(e) {
  let t = Mc;
  return ((Mc = e), t);
}
var t0 = Symbol('NotFound');
function Er(e) {
  return e === t0 || e?.name === '\u0275NotFound';
}
function Cs(e, t) {
  return Object.is(e, t);
}
var Te = null,
  ys = !1,
  Cc = 1,
  xm = null,
  Ae = Symbol('SIGNAL');
function V(e) {
  let t = Te;
  return ((Te = e), t);
}
function Ds() {
  return Te;
}
var fn = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: 'unknown',
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Sr(e) {
  if (ys) throw new Error('');
  if (Te === null) return;
  Te.consumerOnSignalRead(e);
  let t = Te.producersTail;
  if (t !== void 0 && t.producer === e) return;
  let n,
    r = Te.recomputing;
  if (r && ((n = t !== void 0 ? t.nextProducer : Te.producers), n !== void 0 && n.producer === e)) {
    ((Te.producersTail = n), (n.lastReadVersion = e.version));
    return;
  }
  let o = e.consumersTail;
  if (o !== void 0 && o.consumer === Te && (!r || Cm(o, Te))) return;
  let i = Tr(Te),
    s = {
      producer: e,
      consumer: Te,
      nextProducer: n,
      prevConsumer: o,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  ((Te.producersTail = s), t !== void 0 ? (t.nextProducer = s) : (Te.producers = s), i && r0(e, s));
}
function n0() {
  Cc++;
}
function bs(e) {
  if (!(Tr(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Cc)) {
    if (!e.producerMustRecompute(e) && !Ir(e)) {
      Ms(e);
      return;
    }
    (e.producerRecomputeValue(e), Ms(e));
  }
}
function Dc(e) {
  if (e.consumers === void 0) return;
  let t = ys;
  ys = !0;
  try {
    for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
      let r = n.consumer;
      r.dirty || Mm(r);
    }
  } finally {
    ys = t;
  }
}
function bc() {
  return Te?.consumerAllowSignalWrites !== !1;
}
function Mm(e) {
  ((e.dirty = !0), Dc(e), e.consumerMarkedDirty?.(e));
}
function Ms(e) {
  ((e.dirty = !1), (e.lastCleanEpoch = Cc));
}
function vn(e) {
  return (e && ((e.producersTail = void 0), (e.recomputing = !0)), V(e));
}
function Un(e, t) {
  if ((V(t), !e)) return;
  e.recomputing = !1;
  let n = e.producersTail,
    r = n !== void 0 ? n.nextProducer : e.producers;
  if (r !== void 0) {
    if (Tr(e))
      do r = Ec(r);
      while (r !== void 0);
    n !== void 0 ? (n.nextProducer = void 0) : (e.producers = void 0);
  }
}
function Ir(e) {
  for (let t = e.producers; t !== void 0; t = t.nextProducer) {
    let n = t.producer,
      r = t.lastReadVersion;
    if (r !== n.version || (bs(n), r !== n.version)) return !0;
  }
  return !1;
}
function zn(e) {
  if (Tr(e)) {
    let t = e.producers;
    for (; t !== void 0; ) t = Ec(t);
  }
  ((e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0));
}
function r0(e, t) {
  let n = e.consumersTail,
    r = Tr(e);
  if (
    (n !== void 0
      ? ((t.nextConsumer = n.nextConsumer), (n.nextConsumer = t))
      : ((t.nextConsumer = void 0), (e.consumers = t)),
    (t.prevConsumer = n),
    (e.consumersTail = t),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer) r0(o.producer, o);
}
function Ec(e) {
  let t = e.producer,
    n = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (t.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((t.consumers = r), !Tr(t))) {
    let i = t.producers;
    for (; i !== void 0; ) i = Ec(i);
  }
  return n;
}
function Tr(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function Es(e) {
  xm?.(e);
}
function Cm(e, t) {
  let n = t.producersTail;
  if (n !== void 0) {
    let r = t.producers;
    do {
      if (r === e) return !0;
      if (r === n) break;
      r = r.nextProducer;
    } while (r !== void 0);
  }
  return !1;
}
function Ss(e, t) {
  let n = Object.create(Dm);
  ((n.computation = e), t !== void 0 && (n.equal = t));
  let r = () => {
    if ((bs(n), Sr(n), n.value === Uo)) throw n.error;
    return n.value;
  };
  return ((r[Ae] = n), Es(n), r);
}
var _s = Symbol('UNSET'),
  xs = Symbol('COMPUTING'),
  Uo = Symbol('ERRORED'),
  Dm = F(w({}, fn), {
    value: _s,
    dirty: !0,
    error: null,
    equal: Cs,
    kind: 'computed',
    producerMustRecompute(e) {
      return e.value === _s || e.value === xs;
    },
    producerRecomputeValue(e) {
      if (e.value === xs) throw new Error('');
      let t = e.value;
      e.value = xs;
      let n = vn(e),
        r,
        o = !1;
      try {
        ((r = e.computation()), V(null), (o = t !== _s && t !== Uo && r !== Uo && e.equal(t, r)));
      } catch (i) {
        ((r = Uo), (e.error = i));
      } finally {
        Un(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      ((e.value = r), e.version++);
    },
  });
function bm() {
  throw new Error();
}
var o0 = bm;
function i0(e) {
  o0(e);
}
function Sc(e) {
  o0 = e;
}
var Em = null;
function Ic(e, t) {
  let n = Object.create(Is);
  ((n.value = e), t !== void 0 && (n.equal = t));
  let r = () => s0(n);
  return ((r[Ae] = n), Es(n), [r, (s) => Ar(n, s), (s) => Tc(n, s)]);
}
function s0(e) {
  return (Sr(e), e.value);
}
function Ar(e, t) {
  (bc() || i0(e), e.equal(e.value, t) || ((e.value = t), Sm(e)));
}
function Tc(e, t) {
  (bc() || i0(e), Ar(e, t(e.value)));
}
var Is = F(w({}, fn), { equal: Cs, value: void 0, kind: 'signal' });
function Sm(e) {
  (e.version++, n0(), Dc(e), Em?.(e));
}
function H(e) {
  return typeof e == 'function';
}
function Rr(e) {
  let n = e((r) => {
    (Error.call(r), (r.stack = new Error().stack));
  });
  return ((n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n);
}
var Ts = Rr(
  (e) =>
    function (n) {
      (e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n));
    },
);
function $n(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var J = class e {
  constructor(t) {
    ((this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n))) for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (H(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Ts ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            a0(i);
          } catch (s) {
            ((t = t ?? []), s instanceof Ts ? (t = [...t, ...s.errors]) : t.push(s));
          }
      }
      if (t) throw new Ts(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) a0(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && $n(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    (n && $n(n, t), t instanceof e && t._removeParent(this));
  }
};
J.EMPTY = (() => {
  let e = new J();
  return ((e.closed = !0), e);
})();
var Ac = J.EMPTY;
function As(e) {
  return e instanceof J || (e && 'closed' in e && H(e.remove) && H(e.add) && H(e.unsubscribe));
}
function a0(e) {
  H(e) ? e() : e.unsubscribe();
}
var yt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Pr = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Pr;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Pr;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Rs(e) {
  Pr.setTimeout(() => {
    let { onUnhandledError: t } = yt;
    if (t) t(e);
    else throw e;
  });
}
function zo() {}
var l0 = Rc('C', void 0, void 0);
function c0(e) {
  return Rc('E', void 0, e);
}
function d0(e) {
  return Rc('N', e, void 0);
}
function Rc(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Gn = null;
function Or(e) {
  if (yt.useDeprecatedSynchronousErrorHandling) {
    let t = !Gn;
    if ((t && (Gn = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Gn;
      if (((Gn = null), n)) throw r;
    }
  } else e();
}
function h0(e) {
  yt.useDeprecatedSynchronousErrorHandling && Gn && ((Gn.errorThrown = !0), (Gn.error = e));
}
var qn = class extends J {
    constructor(t) {
      (super(),
        (this.isStopped = !1),
        t ? ((this.destination = t), As(t) && t.add(this)) : (this.destination = Am));
    }
    static create(t, n, r) {
      return new Nr(t, n, r);
    }
    next(t) {
      this.isStopped ? Oc(d0(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped ? Oc(c0(t), this) : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Oc(l0, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Im = Function.prototype.bind;
function Pc(e, t) {
  return Im.call(e, t);
}
var Nc = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Ps(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Ps(r);
        }
      else Ps(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Ps(n);
        }
    }
  },
  Nr = class extends qn {
    constructor(t, n, r) {
      super();
      let o;
      if (H(t) || !t) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && yt.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && Pc(t.next, i),
              error: t.error && Pc(t.error, i),
              complete: t.complete && Pc(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Nc(o);
    }
  };
function Ps(e) {
  yt.useDeprecatedSynchronousErrorHandling ? h0(e) : Rs(e);
}
function Tm(e) {
  throw e;
}
function Oc(e, t) {
  let { onStoppedNotification: n } = yt;
  n && Pr.setTimeout(() => n(e, t));
}
var Am = { closed: !0, next: zo, error: Tm, complete: zo };
var jr = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function Ze(e) {
  return e;
}
function jc(...e) {
  return Bc(e);
}
function Bc(e) {
  return e.length === 0
    ? Ze
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var U = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return ((r.source = this), (r.operator = n), r);
    }
    subscribe(n, r, o) {
      let i = Pm(n) ? n : new Nr(n, r, o);
      return (
        Or(() => {
          let { operator: s, source: a } = this;
          i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = u0(r)),
        new r((o, i) => {
          let s = new Nr({
            next: (a) => {
              try {
                n(a);
              } catch (l) {
                (i(l), s.unsubscribe());
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n);
    }
    [jr]() {
      return this;
    }
    pipe(...n) {
      return Bc(n)(this);
    }
    toPromise(n) {
      return (
        (n = u0(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return ((e.create = (t) => new e(t)), e);
})();
function u0(e) {
  var t;
  return (t = e ?? yt.Promise) !== null && t !== void 0 ? t : Promise;
}
function Rm(e) {
  return e && H(e.next) && H(e.error) && H(e.complete);
}
function Pm(e) {
  return (e && e instanceof qn) || (Rm(e) && As(e));
}
function Lc(e) {
  return H(e?.lift);
}
function Y(e) {
  return (t) => {
    if (Lc(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function $(e, t, n, r, o) {
  return new Fc(e, t, n, r, o);
}
var Fc = class extends qn {
  constructor(t, n, r, o, i, s) {
    (super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (l) {
              t.error(l);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (l) {
              t.error(l);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      (super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this)));
    }
  }
};
function Br() {
  return Y((e, t) => {
    let n = null;
    e._refCount++;
    let r = $(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      ((n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe());
    });
    (e.subscribe(r), r.closed || (n = e.connect()));
  });
}
var Lr = class extends U {
  constructor(t, n) {
    (super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Lc(t) && (this.lift = t.lift));
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return ((!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject);
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    ((this._subject = this._connection = null), t?.unsubscribe());
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new J();
      let n = this.getSubject();
      (t.add(
        this.source.subscribe(
          $(
            n,
            void 0,
            () => {
              (this._teardown(), n.complete());
            },
            (r) => {
              (this._teardown(), n.error(r));
            },
            () => this._teardown(),
          ),
        ),
      ),
        t.closed && ((this._connection = null), (t = J.EMPTY)));
    }
    return t;
  }
  refCount() {
    return Br()(this);
  }
};
var Fr = {
  schedule(e) {
    let t = requestAnimationFrame,
      n = cancelAnimationFrame,
      { delegate: r } = Fr;
    r && ((t = r.requestAnimationFrame), (n = r.cancelAnimationFrame));
    let o = t((i) => {
      ((n = void 0), e(i));
    });
    return new J(() => n?.(o));
  },
  requestAnimationFrame(...e) {
    let { delegate: t } = Fr;
    return (t?.requestAnimationFrame || requestAnimationFrame)(...e);
  },
  cancelAnimationFrame(...e) {
    let { delegate: t } = Fr;
    return (t?.cancelAnimationFrame || cancelAnimationFrame)(...e);
  },
  delegate: void 0,
};
var p0 = Rr(
  (e) =>
    function () {
      (e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed'));
    },
);
var P = (() => {
    class e extends U {
      constructor() {
        (super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null));
      }
      lift(n) {
        let r = new Os(this, this);
        return ((r.operator = n), r);
      }
      _throwIfClosed() {
        if (this.closed) throw new p0();
      }
      next(n) {
        Or(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        Or(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ((this.hasError = this.isStopped = !0), (this.thrownError = n));
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        Or(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        ((this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null));
      }
      get observed() {
        var n;
        return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
      }
      _trySubscribe(n) {
        return (this._throwIfClosed(), super._trySubscribe(n));
      }
      _subscribe(n) {
        return (this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n));
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Ac
          : ((this.currentObservers = null),
            i.push(n),
            new J(() => {
              ((this.currentObservers = null), $n(i, n));
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new U();
        return ((n.source = this), n);
      }
    }
    return ((e.create = (t, n) => new Os(t, n)), e);
  })(),
  Os = class extends P {
    constructor(t, n) {
      (super(), (this.destination = t), (this.source = n));
    }
    next(t) {
      var n, r;
      (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null &&
        r !== void 0
        ? r
        : Ac;
    }
  };
var we = class extends P {
  constructor(t) {
    (super(), (this._value = t));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return (!n.closed && t.next(this._value), n);
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return (this._throwIfClosed(), r);
  }
  next(t) {
    super.next((this._value = t));
  }
};
var Vc = {
  now() {
    return (Vc.delegate || Date).now();
  },
  delegate: void 0,
};
var Ns = class extends J {
  constructor(t, n) {
    super();
  }
  schedule(t, n = 0) {
    return this;
  }
};
var $o = {
  setInterval(e, t, ...n) {
    let { delegate: r } = $o;
    return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n);
  },
  clearInterval(e) {
    let { delegate: t } = $o;
    return (t?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var Vr = class extends Ns {
  constructor(t, n) {
    (super(t, n), (this.scheduler = t), (this.work = n), (this.pending = !1));
  }
  schedule(t, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = t;
    let o = this.id,
      i = this.scheduler;
    return (
      o != null && (this.id = this.recycleAsyncId(i, o, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id = (r = this.id) !== null && r !== void 0 ? r : this.requestAsyncId(i, this.id, n)),
      this
    );
  }
  requestAsyncId(t, n, r = 0) {
    return $o.setInterval(t.flush.bind(t, this), r);
  }
  recycleAsyncId(t, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && $o.clearInterval(n);
  }
  execute(t, n) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = !1;
    let r = this._execute(t, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, n) {
    let r = !1,
      o;
    try {
      this.work(t);
    } catch (i) {
      ((r = !0), (o = i || new Error('Scheduled action threw falsy error')));
    }
    if (r) return (this.unsubscribe(), o);
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: n } = this,
        { actions: r } = n;
      ((this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        $n(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe());
    }
  }
};
var Hr = class e {
  constructor(t, n = e.now) {
    ((this.schedulerActionCtor = t), (this.now = n));
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
Hr.now = Vc.now;
var Ur = class extends Hr {
  constructor(t, n = Hr.now) {
    (super(t, n), (this.actions = []), (this._active = !1));
  }
  flush(t) {
    let { actions: n } = this;
    if (this._active) {
      n.push(t);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = n.shift()));
    if (((this._active = !1), r)) {
      for (; (t = n.shift()); ) t.unsubscribe();
      throw r;
    }
  }
};
var Go = new Ur(Vr),
  g0 = Go;
var js = class extends Vr {
  constructor(t, n) {
    (super(t, n), (this.scheduler = t), (this.work = n));
  }
  requestAsyncId(t, n, r = 0) {
    return r !== null && r > 0
      ? super.requestAsyncId(t, n, r)
      : (t.actions.push(this),
        t._scheduled || (t._scheduled = Fr.requestAnimationFrame(() => t.flush(void 0))));
  }
  recycleAsyncId(t, n, r = 0) {
    var o;
    if (r != null ? r > 0 : this.delay > 0) return super.recycleAsyncId(t, n, r);
    let { actions: i } = t;
    n != null &&
      n === t._scheduled &&
      ((o = i[i.length - 1]) === null || o === void 0 ? void 0 : o.id) !== n &&
      (Fr.cancelAnimationFrame(n), (t._scheduled = void 0));
  }
};
var Bs = class extends Ur {
  flush(t) {
    this._active = !0;
    let n;
    t ? (n = t.id) : ((n = this._scheduled), (this._scheduled = void 0));
    let { actions: r } = this,
      o;
    t = t || r.shift();
    do if ((o = t.execute(t.state, t.delay))) break;
    while ((t = r[0]) && t.id === n && r.shift());
    if (((this._active = !1), o)) {
      for (; (t = r[0]) && t.id === n && r.shift(); ) t.unsubscribe();
      throw o;
    }
  }
};
var Ls = new Bs(js);
var Re = new U((e) => e.complete());
function Fs(e) {
  return e && H(e.schedule);
}
function Hc(e) {
  return e[e.length - 1];
}
function Vs(e) {
  return H(Hc(e)) ? e.pop() : void 0;
}
function Bt(e) {
  return Fs(Hc(e)) ? e.pop() : void 0;
}
function f0(e, t) {
  return typeof Hc(e) == 'number' ? e.pop() : t;
}
function w0(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(d) {
      try {
        c(r.next(d));
      } catch (h) {
        s(h);
      }
    }
    function l(d) {
      try {
        c(r.throw(d));
      } catch (h) {
        s(h);
      }
    }
    function c(d) {
      d.done ? i(d.value) : o(d.value).then(a, l);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
function v0(e) {
  var t = typeof Symbol == 'function' && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e });
      },
    };
  throw new TypeError(t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function Wn(e) {
  return this instanceof Wn ? ((this.v = e), this) : new Wn(e);
}
function m0(e, t, n) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create((typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype)),
    a('next'),
    a('throw'),
    a('return', s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(p) {
    return function (x) {
      return Promise.resolve(x).then(p, h);
    };
  }
  function a(p, x) {
    r[p] &&
      ((o[p] = function (R) {
        return new Promise(function (L, Z) {
          i.push([p, R, L, Z]) > 1 || l(p, R);
        });
      }),
      x && (o[p] = x(o[p])));
  }
  function l(p, x) {
    try {
      c(r[p](x));
    } catch (R) {
      g(i[0][3], R);
    }
  }
  function c(p) {
    p.value instanceof Wn ? Promise.resolve(p.value.v).then(d, h) : g(i[0][2], p);
  }
  function d(p) {
    l('next', p);
  }
  function h(p) {
    l('throw', p);
  }
  function g(p, x) {
    (p(x), i.shift(), i.length && l(i[0][0], i[0][1]));
  }
}
function k0(e) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof v0 == 'function' ? v0(e) : e[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, l) {
          ((s = e[i](s)), o(a, l, s.done, s.value));
        });
      };
  }
  function o(i, s, a, l) {
    Promise.resolve(l).then(function (c) {
      i({ value: c, done: a });
    }, s);
  }
}
var Hs = (e) => e && typeof e.length == 'number' && typeof e != 'function';
function Us(e) {
  return H(e?.then);
}
function zs(e) {
  return H(e[jr]);
}
function $s(e) {
  return Symbol.asyncIterator && H(e?.[Symbol.asyncIterator]);
}
function Gs(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Om() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var qs = Om();
function Ws(e) {
  return H(e?.[qs]);
}
function Zs(e) {
  return m0(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Wn(n.read());
        if (o) return yield Wn(void 0);
        yield yield Wn(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Ys(e) {
  return H(e?.getReader);
}
function le(e) {
  if (e instanceof U) return e;
  if (e != null) {
    if (zs(e)) return Nm(e);
    if (Hs(e)) return jm(e);
    if (Us(e)) return Bm(e);
    if ($s(e)) return y0(e);
    if (Ws(e)) return Lm(e);
    if (Ys(e)) return Fm(e);
  }
  throw Gs(e);
}
function Nm(e) {
  return new U((t) => {
    let n = e[jr]();
    if (H(n.subscribe)) return n.subscribe(t);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function jm(e) {
  return new U((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Bm(e) {
  return new U((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, Rs);
  });
}
function Lm(e) {
  return new U((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function y0(e) {
  return new U((t) => {
    Vm(e, t).catch((n) => t.error(n));
  });
}
function Fm(e) {
  return y0(Zs(e));
}
function Vm(e, t) {
  var n, r, o, i;
  return w0(this, void 0, void 0, function* () {
    try {
      for (n = k0(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function ze(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    (n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((e.add(i), !o)) return i;
}
function Ks(e, t = 0) {
  return Y((n, r) => {
    n.subscribe(
      $(
        r,
        (o) => ze(r, e, () => r.next(o), t),
        () => ze(r, e, () => r.complete(), t),
        (o) => ze(r, e, () => r.error(o), t),
      ),
    );
  });
}
function Qs(e, t = 0) {
  return Y((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function _0(e, t) {
  return le(e).pipe(Qs(t), Ks(t));
}
function x0(e, t) {
  return le(e).pipe(Qs(t), Ks(t));
}
function M0(e, t) {
  return new U((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function C0(e, t) {
  return new U((n) => {
    let r;
    return (
      ze(n, t, () => {
        ((r = e[qs]()),
          ze(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0,
          ));
      }),
      () => H(r?.return) && r.return()
    );
  });
}
function Xs(e, t) {
  if (!e) throw new Error('Iterable cannot be null');
  return new U((n) => {
    ze(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      ze(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function D0(e, t) {
  return Xs(Zs(e), t);
}
function b0(e, t) {
  if (e != null) {
    if (zs(e)) return _0(e, t);
    if (Hs(e)) return M0(e, t);
    if (Us(e)) return x0(e, t);
    if ($s(e)) return Xs(e, t);
    if (Ws(e)) return C0(e, t);
    if (Ys(e)) return D0(e, t);
  }
  throw Gs(e);
}
function ce(e, t) {
  return t ? b0(e, t) : le(e);
}
function j(...e) {
  let t = Bt(e);
  return ce(e, t);
}
function zr(e, t) {
  let n = H(e) ? e : () => e,
    r = (o) => o.error(n());
  return new U(t ? (o) => t.schedule(r, 0, o) : r);
}
function $r(e) {
  return !!e && (e instanceof U || (H(e.lift) && H(e.subscribe)));
}
var Qt = Rr(
  (e) =>
    function () {
      (e(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence'));
    },
);
function E0(e) {
  return e instanceof Date && !isNaN(e);
}
function G(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe(
      $(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: Hm } = Array;
function Um(e, t) {
  return Hm(t) ? e(...t) : e(t);
}
function Js(e) {
  return G((t) => Um(e, t));
}
var { isArray: zm } = Array,
  { getPrototypeOf: $m, prototype: Gm, keys: qm } = Object;
function ea(e) {
  if (e.length === 1) {
    let t = e[0];
    if (zm(t)) return { args: t, keys: null };
    if (Wm(t)) {
      let n = qm(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Wm(e) {
  return e && typeof e == 'object' && $m(e) === Gm;
}
function ta(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function na(...e) {
  let t = Bt(e),
    n = Vs(e),
    { args: r, keys: o } = ea(e);
  if (r.length === 0) return ce([], t);
  let i = new U(Zm(r, t, o ? (s) => ta(o, s) : Ze));
  return n ? i.pipe(Js(n)) : i;
}
function Zm(e, t, n = Ze) {
  return (r) => {
    S0(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let l = 0; l < o; l++)
          S0(
            t,
            () => {
              let c = ce(e[l], t),
                d = !1;
              c.subscribe(
                $(
                  r,
                  (h) => {
                    ((i[l] = h), d || ((d = !0), a--), a || r.next(n(i.slice())));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function S0(e, t, n) {
  e ? ze(n, e, t) : t();
}
function I0(e, t, n, r, o, i, s, a) {
  let l = [],
    c = 0,
    d = 0,
    h = !1,
    g = () => {
      h && !l.length && !c && t.complete();
    },
    p = (R) => (c < r ? x(R) : l.push(R)),
    x = (R) => {
      (i && t.next(R), c++);
      let L = !1;
      le(n(R, d++)).subscribe(
        $(
          t,
          (Z) => {
            (o?.(Z), i ? p(Z) : t.next(Z));
          },
          () => {
            L = !0;
          },
          void 0,
          () => {
            if (L)
              try {
                for (c--; l.length && c < r; ) {
                  let Z = l.shift();
                  s ? ze(t, s, () => x(Z)) : x(Z);
                }
                g();
              } catch (Z) {
                t.error(Z);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      $(t, p, () => {
        ((h = !0), g());
      }),
    ),
    () => {
      a?.();
    }
  );
}
function me(e, t, n = 1 / 0) {
  return H(t)
    ? me((r, o) => G((i, s) => t(r, i, o, s))(le(e(r, o))), n)
    : (typeof t == 'number' && (n = t), Y((r, o) => I0(r, o, e, n)));
}
function ra(e = 1 / 0) {
  return me(Ze, e);
}
function T0() {
  return ra(1);
}
function Gr(...e) {
  return T0()(ce(e, Bt(e)));
}
function qo(e) {
  return new U((t) => {
    le(e()).subscribe(t);
  });
}
function Uc(...e) {
  let t = Vs(e),
    { args: n, keys: r } = ea(e),
    o = new U((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        l = s,
        c = s;
      for (let d = 0; d < s; d++) {
        let h = !1;
        le(n[d]).subscribe(
          $(
            i,
            (g) => {
              (h || ((h = !0), c--), (a[d] = g));
            },
            () => l--,
            void 0,
            () => {
              (!l || !h) && (c || i.next(r ? ta(r, a) : a), i.complete());
            },
          ),
        );
      }
    });
  return t ? o.pipe(Js(t)) : o;
}
function oa(e = 0, t, n = g0) {
  let r = -1;
  return (
    t != null && (Fs(t) ? (n = t) : (r = t)),
    new U((o) => {
      let i = E0(e) ? +e - n.now() : e;
      i < 0 && (i = 0);
      let s = 0;
      return n.schedule(function () {
        o.closed || (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
      }, i);
    })
  );
}
function zc(e = 0, t = Go) {
  return (e < 0 && (e = 0), oa(e, e, t));
}
function Wo(...e) {
  let t = Bt(e),
    n = f0(e, 1 / 0),
    r = e;
  return r.length ? (r.length === 1 ? le(r[0]) : ra(n)(ce(r, t))) : Re;
}
function $e(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe($(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function A0(e) {
  return Y((t, n) => {
    let r = !1,
      o = null,
      i = null,
      s = !1,
      a = () => {
        if ((i?.unsubscribe(), (i = null), r)) {
          r = !1;
          let c = o;
          ((o = null), n.next(c));
        }
        s && n.complete();
      },
      l = () => {
        ((i = null), s && n.complete());
      };
    t.subscribe(
      $(
        n,
        (c) => {
          ((r = !0), (o = c), i || le(e(c)).subscribe((i = $(n, a, l))));
        },
        () => {
          ((s = !0), (!r || !i || i.closed) && n.complete());
        },
      ),
    );
  });
}
function ia(e, t = Go) {
  return A0(() => oa(e, t));
}
function wn(e) {
  return Y((t, n) => {
    let r = null,
      o = !1,
      i;
    ((r = t.subscribe(
      $(n, void 0, void 0, (s) => {
        ((i = le(e(s, wn(e)(t)))), r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0));
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n)));
  });
}
function R0(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      l = t,
      c = 0;
    i.subscribe(
      $(
        s,
        (d) => {
          let h = c++;
          ((l = a ? e(l, d, h) : ((a = !0), d)), r && s.next(l));
        },
        o &&
          (() => {
            (a && s.next(l), s.complete());
          }),
      ),
    );
  };
}
function qr(e, t) {
  return H(t) ? me(e, t, 1) : me(e, 1);
}
function mn(e) {
  return Y((t, n) => {
    let r = !1;
    t.subscribe(
      $(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => {
          (r || n.next(e), n.complete());
        },
      ),
    );
  });
}
function _t(e) {
  return e <= 0
    ? () => Re
    : Y((t, n) => {
        let r = 0;
        t.subscribe(
          $(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function sa(e = Ym) {
  return Y((t, n) => {
    let r = !1;
    t.subscribe(
      $(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function Ym() {
  return new Qt();
}
function Zo(e) {
  return Y((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Xt(e, t) {
  let n = arguments.length >= 2;
  return (r) => r.pipe(e ? $e((o, i) => e(o, i, r)) : Ze, _t(1), n ? mn(t) : sa(() => new Qt()));
}
function Wr(e) {
  return e <= 0
    ? () => Re
    : Y((t, n) => {
        let r = [];
        t.subscribe(
          $(
            n,
            (o) => {
              (r.push(o), e < r.length && r.shift());
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function $c(e, t) {
  let n = arguments.length >= 2;
  return (r) => r.pipe(e ? $e((o, i) => e(o, i, r)) : Ze, Wr(1), n ? mn(t) : sa(() => new Qt()));
}
function Gc(e, t) {
  return Y(R0(e, t, arguments.length >= 2, !0));
}
function Zn(...e) {
  let t = Bt(e);
  return Y((n, r) => {
    (t ? Gr(e, n, t) : Gr(e, n)).subscribe(r);
  });
}
function be(e, t) {
  return Y((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      $(
        r,
        (l) => {
          o?.unsubscribe();
          let c = 0,
            d = i++;
          le(e(l, d)).subscribe(
            (o = $(
              r,
              (h) => r.next(t ? t(l, h, d, c++) : h),
              () => {
                ((o = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function Lt(e) {
  return Y((t, n) => {
    (le(e).subscribe($(n, () => n.complete(), zo)), !n.closed && t.subscribe(n));
  });
}
function fe(e, t, n) {
  let r = H(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? Y((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          $(
            i,
            (l) => {
              var c;
              ((c = r.next) === null || c === void 0 || c.call(r, l), i.next(l));
            },
            () => {
              var l;
              ((a = !1), (l = r.complete) === null || l === void 0 || l.call(r), i.complete());
            },
            (l) => {
              var c;
              ((a = !1), (c = r.error) === null || c === void 0 || c.call(r, l), i.error(l));
            },
            () => {
              var l, c;
              (a && ((l = r.unsubscribe) === null || l === void 0 || l.call(r)),
                (c = r.finalize) === null || c === void 0 || c.call(r));
            },
          ),
        );
      })
    : Ze;
}
function P0(e) {
  let t = V(null);
  try {
    return e();
  } finally {
    V(t);
  }
}
var od = 'https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss',
  b = class extends Error {
    code;
    constructor(t, n) {
      (super(Yr(t, n)), (this.code = t));
    }
  };
function Km(e) {
  return `NG0${Math.abs(e)}`;
}
function Yr(e, t) {
  return `${Km(e)}${t ? ': ' + t : ''}`;
}
function te(e) {
  for (let t in e) if (e[t] === te) return t;
  throw Error('');
}
function j0(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function en(e) {
  if (typeof e == 'string') return e;
  if (Array.isArray(e)) return `[${e.map(en).join(', ')}]`;
  if (e == null) return '' + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return '' + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function id(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || '';
}
var Qm = te({ __forward_ref__: te });
function Mt(e) {
  return (
    (e.__forward_ref__ = Mt),
    (e.toString = function () {
      return en(this());
    }),
    e
  );
}
function Ee(e) {
  return sd(e) ? e() : e;
}
function sd(e) {
  return typeof e == 'function' && e.hasOwnProperty(Qm) && e.__forward_ref__ === Mt;
}
function B0(e, t) {
  e == null && ad(t, e, null, '!=');
}
function ad(e, t, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${e}` + (r == null ? '' : ` [Expected=> ${n} ${r} ${t} <=Actual]`),
  );
}
function y(e) {
  return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
}
function Pe(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function ei(e) {
  return Xm(e, ha);
}
function ld(e) {
  return ei(e) !== null;
}
function Xm(e, t) {
  return (e.hasOwnProperty(t) && e[t]) || null;
}
function Jm(e) {
  let t = e?.[ha] ?? null;
  return t || null;
}
function Wc(e) {
  return e && e.hasOwnProperty(la) ? e[la] : null;
}
var ha = te({ ɵprov: te }),
  la = te({ ɵinj: te }),
  _ = class {
    _desc;
    ngMetadataName = 'InjectionToken';
    ɵprov;
    constructor(t, n) {
      ((this._desc = t),
        (this.ɵprov = void 0),
        typeof n == 'number'
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = y({
              token: this,
              providedIn: n.providedIn || 'root',
              factory: n.factory,
            })));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function cd(e) {
  return e && !!e.ɵproviders;
}
var dd = te({ ɵcmp: te }),
  hd = te({ ɵdir: te }),
  ud = te({ ɵpipe: te }),
  pd = te({ ɵmod: te }),
  Qo = te({ ɵfac: te }),
  er = te({ __NG_ELEMENT_ID__: te }),
  O0 = te({ __NG_ENV_ID__: te });
function ua(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e);
}
function ca(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : ua(e);
}
var gd = te({ ngErrorCode: te }),
  L0 = te({ ngErrorMessage: te }),
  Ko = te({ ngTokenPath: te });
function fd(e, t) {
  return F0('', -200, t);
}
function pa(e, t) {
  throw new b(-201, !1);
}
function e4(e, t) {
  e[Ko] ??= [];
  let n = e[Ko],
    r;
  (typeof t == 'object' && 'multi' in t && t?.multi === !0
    ? (B0(t.provide, 'Token with multi: true should have a provide property'), (r = ca(t.provide)))
    : (r = ca(t)),
    n[0] !== r && e[Ko].unshift(r));
}
function t4(e, t) {
  let n = e[Ko],
    r = e[gd],
    o = e[L0] || e.message;
  return ((e.message = r4(o, r, n, t)), e);
}
function F0(e, t, n) {
  let r = new b(t, e);
  return ((r[gd] = t), (r[L0] = e), n && (r[Ko] = n), r);
}
function n4(e) {
  return e[gd];
}
function r4(e, t, n = [], r = null) {
  let o = '';
  n && n.length > 1 && (o = ` Path: ${n.join(' -> ')}.`);
  let i = r ? ` Source: ${r}.` : '';
  return Yr(t, `${e}${i}${o}`);
}
var Zc;
function V0() {
  return Zc;
}
function Ye(e) {
  let t = Zc;
  return ((Zc = e), t);
}
function vd(e, t, n) {
  let r = ei(e);
  if (r && r.providedIn == 'root') return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & 8) return null;
  if (t !== void 0) return t;
  pa(e, 'Injector');
}
var o4 = {},
  Yn = o4,
  Yc = '__NG_DI_FLAG__',
  Kc = class {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, n) {
      let r = Kn(n) || 0;
      try {
        return this.injector.get(t, r & 8 ? null : Yn, r);
      } catch (o) {
        if (Er(o)) return o;
        throw o;
      }
    }
  };
function i4(e, t = 0) {
  let n = ks();
  if (n === void 0) throw new b(-203, !1);
  if (n === null) return vd(e, void 0, t);
  {
    let r = s4(t),
      o = n.retrieve(e, r);
    if (Er(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function O(e, t = 0) {
  return (V0() || i4)(Ee(e), t);
}
function u(e, t) {
  return O(e, Kn(t));
}
function Kn(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function s4(e) {
  return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) };
}
function Qc(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = Ee(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new b(900, !1);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          l = a4(a);
        typeof l == 'number' ? (l === -1 ? (o = a.token) : (i |= l)) : (o = a);
      }
      t.push(O(o, i));
    } else t.push(O(r));
  }
  return t;
}
function wd(e, t) {
  return ((e[Yc] = t), (e.prototype[Yc] = t), e);
}
function a4(e) {
  return e[Yc];
}
function Qn(e, t) {
  let n = e.hasOwnProperty(Qo);
  return n ? e[Qo] : null;
}
function H0(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
  }
  return !0;
}
function U0(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function ga(e, t) {
  e.forEach((n) => (Array.isArray(n) ? ga(n, t) : t(n)));
}
function md(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function ti(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function z0(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) (e.push(r, e[0]), (e[0] = n));
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      ((e[o] = e[i]), o--);
    }
    ((e[t] = n), (e[t + 1] = r));
  }
}
function $0(e, t, n) {
  let r = Kr(e, t);
  return (r >= 0 ? (e[r | 1] = n) : ((r = ~r), z0(e, r, t, n)), r);
}
function fa(e, t) {
  let n = Kr(e, t);
  if (n >= 0) return e[n | 1];
}
function Kr(e, t) {
  return l4(e, t, 1);
}
function l4(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var yn = {},
  Ke = [],
  _n = new _(''),
  kd = new _('', -1),
  yd = new _(''),
  Xo = class {
    get(t, n = Yn) {
      if (n === Yn) {
        let o = F0('', -201);
        throw ((o.name = '\u0275NotFound'), o);
      }
      return n;
    }
  };
function _d(e) {
  return e[pd] || null;
}
function tn(e) {
  return e[dd] || null;
}
function xd(e) {
  return e[hd] || null;
}
function G0(e) {
  return e[ud] || null;
}
function ni(e) {
  return { ɵproviders: e };
}
function q0(...e) {
  return { ɵproviders: Md(!0, e), ɵfromNgModule: !0 };
}
function Md(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    ga(t, (s) => {
      let a = s;
      da(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && W0(o, i),
    n
  );
}
function W0(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Cd(o, (i) => {
      t(i, r);
    });
  }
}
function da(e, t, n, r) {
  if (((e = Ee(e)), !e)) return !1;
  let o = null,
    i = Wc(e),
    s = !i && tn(e);
  if (!i && !s) {
    let l = e.ngModule;
    if (((i = Wc(l)), i)) o = l;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let l = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let c of l) da(c, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let c;
      try {
        ga(i.imports, (d) => {
          da(d, t, n, r) && ((c ||= []), c.push(d));
        });
      } finally {
      }
      c !== void 0 && W0(c, t);
    }
    if (!a) {
      let c = Qn(o) || (() => new o());
      (t({ provide: o, useFactory: c, deps: Ke }, o),
        t({ provide: yd, useValue: o, multi: !0 }, o),
        t({ provide: _n, useValue: () => O(o), multi: !0 }, o));
    }
    let l = i.providers;
    if (l != null && !a) {
      let c = e;
      Cd(l, (d) => {
        t(d, c);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Cd(e, t) {
  for (let n of e) (cd(n) && (n = n.ɵproviders), Array.isArray(n) ? Cd(n, t) : t(n));
}
var c4 = te({ provide: String, useValue: te });
function Z0(e) {
  return e !== null && typeof e == 'object' && c4 in e;
}
function d4(e) {
  return !!(e && e.useExisting);
}
function h4(e) {
  return !!(e && e.useFactory);
}
function Xn(e) {
  return typeof e == 'function';
}
function Y0(e) {
  return !!e.useClass;
}
var ri = new _(''),
  aa = {},
  N0 = {},
  qc;
function Qr() {
  return (qc === void 0 && (qc = new Xo()), qc);
}
var ke = class {},
  Jn = class extends ke {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, o) {
      (super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        Jc(t, (s) => this.processProvider(s)),
        this.records.set(kd, Zr(void 0, this)),
        o.has('environment') && this.records.set(ke, Zr(void 0, this)));
      let i = this.records.get(ri);
      (i != null && typeof i.value == 'string' && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(yd, Ke, { self: !0 }))));
    }
    retrieve(t, n) {
      let r = Kn(n) || 0;
      try {
        return this.get(t, Yn, r);
      } catch (o) {
        if (Er(o)) return o;
        throw o;
      }
    }
    destroy() {
      (Yo(this), (this._destroyed = !0));
      let t = V(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        (this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), V(t));
      }
    }
    onDestroy(t) {
      return (Yo(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t));
    }
    runInContext(t) {
      Yo(this);
      let n = jt(this),
        r = Ye(void 0),
        o;
      try {
        return t();
      } finally {
        (jt(n), Ye(r));
      }
    }
    get(t, n = Yn, r) {
      if ((Yo(this), t.hasOwnProperty(O0))) return t[O0](this);
      let o = Kn(r),
        i,
        s = jt(this),
        a = Ye(void 0);
      try {
        if (!(o & 4)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let d = v4(t) && ei(t);
            (d && this.injectableDefInScope(d) ? (c = Zr(Xc(t), aa)) : (c = null),
              this.records.set(t, c));
          }
          if (c != null) return this.hydrate(t, c, o);
        }
        let l = o & 2 ? Qr() : this.parent;
        return ((n = o & 8 && n === Yn ? null : n), l.get(t, n));
      } catch (l) {
        let c = n4(l);
        throw c === -200 || c === -201 ? new b(c, null) : l;
      } finally {
        (Ye(a), jt(s));
      }
    }
    resolveInjectorInitializers() {
      let t = V(null),
        n = jt(this),
        r = Ye(void 0),
        o;
      try {
        let i = this.get(_n, Ke, { self: !0 });
        for (let s of i) s();
      } finally {
        (jt(n), Ye(r), V(t));
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(en(r));
      return `R3Injector[${t.join(', ')}]`;
    }
    processProvider(t) {
      t = Ee(t);
      let n = Xn(t) ? t : Ee(t && t.provide),
        r = p4(t);
      if (!Xn(t) && t.multi === !0) {
        let o = this.records.get(n);
        (o || ((o = Zr(void 0, aa, !0)), (o.factory = () => Qc(o.multi)), this.records.set(n, o)),
          (n = t),
          o.multi.push(t));
      }
      this.records.set(n, r);
    }
    hydrate(t, n, r) {
      let o = V(null);
      try {
        if (n.value === N0) throw fd(en(t));
        return (
          n.value === aa && ((n.value = N0), (n.value = n.factory(void 0, r))),
          typeof n.value == 'object' &&
            n.value &&
            f4(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        V(o);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = Ee(t.providedIn);
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Xc(e) {
  let t = ei(e),
    n = t !== null ? t.factory : Qn(e);
  if (n !== null) return n;
  if (e instanceof _) throw new b(204, !1);
  if (e instanceof Function) return u4(e);
  throw new b(204, !1);
}
function u4(e) {
  if (e.length > 0) throw new b(204, !1);
  let n = Jm(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function p4(e) {
  if (Z0(e)) return Zr(void 0, e.useValue);
  {
    let t = Dd(e);
    return Zr(t, aa);
  }
}
function Dd(e, t, n) {
  let r;
  if (Xn(e)) {
    let o = Ee(e);
    return Qn(o) || Xc(o);
  } else if (Z0(e)) r = () => Ee(e.useValue);
  else if (h4(e)) r = () => e.useFactory(...Qc(e.deps || []));
  else if (d4(e)) r = (o, i) => O(Ee(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = Ee(e && (e.useClass || e.provide));
    if (g4(e)) r = () => new o(...Qc(e.deps));
    else return Qn(o) || Xc(o);
  }
  return r;
}
function Yo(e) {
  if (e.destroyed) throw new b(205, !1);
}
function Zr(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function g4(e) {
  return !!e.deps;
}
function f4(e) {
  return e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function';
}
function v4(e) {
  return typeof e == 'function' || (typeof e == 'object' && e.ngMetadataName === 'InjectionToken');
}
function Jc(e, t) {
  for (let n of e) Array.isArray(n) ? Jc(n, t) : n && cd(n) ? Jc(n.ɵproviders, t) : t(n);
}
function Se(e, t) {
  let n;
  e instanceof Jn ? (Yo(e), (n = e)) : (n = new Kc(e));
  let r,
    o = jt(n),
    i = Ye(void 0);
  try {
    return t();
  } finally {
    (jt(o), Ye(i));
  }
}
function K0() {
  return V0() !== void 0 || ks() != null;
}
var Ct = 0,
  B = 1,
  N = 2,
  Me = 3,
  st = 4,
  at = 5,
  oi = 6,
  Xr = 7,
  Oe = 8,
  Ft = 9,
  nn = 10,
  ae = 11,
  Jr = 12,
  bd = 13,
  tr = 14,
  lt = 15,
  xn = 16,
  nr = 17,
  Vt = 18,
  ii = 19,
  Ed = 20,
  Jt = 21,
  va = 22,
  rn = 23,
  Qe = 24,
  rr = 25,
  Ge = 26,
  Q0 = 1;
var Mn = 7,
  si = 8,
  or = 9,
  Le = 10;
function Ht(e) {
  return Array.isArray(e) && typeof e[Q0] == 'object';
}
function Dt(e) {
  return Array.isArray(e) && e[Q0] === !0;
}
function Sd(e) {
  return (e.flags & 4) !== 0;
}
function Cn(e) {
  return e.componentOffset > -1;
}
function eo(e) {
  return (e.flags & 1) === 1;
}
function Ut(e) {
  return !!e.template;
}
function to(e) {
  return (e[N] & 512) !== 0;
}
function ir(e) {
  return (e[N] & 256) === 256;
}
var X0 = 'svg',
  J0 = 'math';
function ct(e) {
  for (; Array.isArray(e); ) e = e[Ct];
  return e;
}
function Id(e, t) {
  return ct(t[e]);
}
function Xe(e, t) {
  return ct(t[e.index]);
}
function wa(e, t) {
  return e.data[t];
}
function dt(e, t) {
  let n = t[e];
  return Ht(n) ? n : n[Ct];
}
function e2(e) {
  return (e[N] & 4) === 4;
}
function ma(e) {
  return (e[N] & 128) === 128;
}
function t2(e) {
  return Dt(e[Me]);
}
function ai(e, t) {
  return t == null ? null : e[t];
}
function Td(e) {
  e[nr] = 0;
}
function Ad(e) {
  e[N] & 1024 || ((e[N] |= 1024), ma(e) && Dn(e));
}
function n2(e, t) {
  for (; e > 0; ) ((t = t[tr]), e--);
  return t;
}
function li(e) {
  return !!(e[N] & 9216 || e[Qe]?.dirty);
}
function ka(e) {
  (e[nn].changeDetectionScheduler?.notify(8), e[N] & 64 && (e[N] |= 1024), li(e) && Dn(e));
}
function Dn(e) {
  e[nn].changeDetectionScheduler?.notify(0);
  let t = kn(e);
  for (; t !== null && !(t[N] & 8192 || ((t[N] |= 8192), !ma(t))); ) t = kn(t);
}
function Rd(e, t) {
  if (ir(e)) throw new b(911, !1);
  (e[Jt] === null && (e[Jt] = []), e[Jt].push(t));
}
function r2(e, t) {
  if (e[Jt] === null) return;
  let n = e[Jt].indexOf(t);
  n !== -1 && e[Jt].splice(n, 1);
}
function kn(e) {
  let t = e[Me];
  return Dt(t) ? t[Me] : t;
}
function Pd(e) {
  return (e[Xr] ??= []);
}
function Od(e) {
  return (e.cleanup ??= []);
}
function Nd(e, t, n, r) {
  let o = Pd(t);
  (o.push(n), e.firstCreatePass && Od(e).push(r, o.length - 1));
}
var q = { lFrame: k2(null), bindingsEnabled: !0, skipHydrationRootTNode: null },
  ci = (function (e) {
    return (
      (e[(e.Off = 0)] = 'Off'),
      (e[(e.Exhaustive = 1)] = 'Exhaustive'),
      (e[(e.OnlyDirtyViews = 2)] = 'OnlyDirtyViews'),
      e
    );
  })(ci || {}),
  w4 = 0,
  ed = !1;
function o2() {
  return q.lFrame.elementDepthCount;
}
function i2() {
  q.lFrame.elementDepthCount++;
}
function s2() {
  q.lFrame.elementDepthCount--;
}
function ya() {
  return q.bindingsEnabled;
}
function a2() {
  return q.skipHydrationRootTNode !== null;
}
function l2(e) {
  return q.skipHydrationRootTNode === e;
}
function c2() {
  q.skipHydrationRootTNode = null;
}
function K() {
  return q.lFrame.lView;
}
function Ie() {
  return q.lFrame.tView;
}
function C(e) {
  return ((q.lFrame.contextLView = e), e[Oe]);
}
function D(e) {
  return ((q.lFrame.contextLView = null), e);
}
function ye() {
  let e = jd();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function jd() {
  return q.lFrame.currentTNode;
}
function d2() {
  let e = q.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function no(e, t) {
  let n = q.lFrame;
  ((n.currentTNode = e), (n.isParent = t));
}
function Bd() {
  return q.lFrame.isParent;
}
function h2() {
  q.lFrame.isParent = !1;
}
function Ld(e) {
  (ad('Must never be called in production mode'), (w4 = e));
}
function Fd() {
  return ed;
}
function ro(e) {
  let t = ed;
  return ((ed = e), t);
}
function Vd() {
  let e = q.lFrame,
    t = e.bindingRootIndex;
  return (t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t);
}
function u2(e) {
  return (q.lFrame.bindingIndex = e);
}
function di() {
  return q.lFrame.bindingIndex++;
}
function p2(e) {
  let t = q.lFrame,
    n = t.bindingIndex;
  return ((t.bindingIndex = t.bindingIndex + e), n);
}
function g2() {
  return q.lFrame.inI18n;
}
function f2(e, t) {
  let n = q.lFrame;
  ((n.bindingIndex = n.bindingRootIndex = e), _a(t));
}
function v2() {
  return q.lFrame.currentDirectiveIndex;
}
function _a(e) {
  q.lFrame.currentDirectiveIndex = e;
}
function w2(e) {
  let t = q.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function Hd() {
  return q.lFrame.currentQueryIndex;
}
function xa(e) {
  q.lFrame.currentQueryIndex = e;
}
function m4(e) {
  let t = e[B];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[at] : null;
}
function Ud(e, t, n) {
  if (n & 4) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & 1); )
      if (((o = m4(i)), o === null || ((i = i[tr]), o.type & 10))) break;
    if (o === null) return !1;
    ((t = o), (e = i));
  }
  let r = (q.lFrame = m2());
  return ((r.currentTNode = t), (r.lView = e), !0);
}
function Ma(e) {
  let t = m2(),
    n = e[B];
  ((q.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1));
}
function m2() {
  let e = q.lFrame,
    t = e === null ? null : e.child;
  return t === null ? k2(e) : t;
}
function k2(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return (e !== null && (e.child = t), t);
}
function y2() {
  let e = q.lFrame;
  return ((q.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e);
}
var zd = y2;
function Ca() {
  let e = y2();
  ((e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0));
}
function _2(e) {
  return (q.lFrame.contextLView = n2(e, q.lFrame.contextLView))[Oe];
}
function sr() {
  return q.lFrame.selectedIndex;
}
function bn(e) {
  q.lFrame.selectedIndex = e;
}
function Da() {
  let e = q.lFrame;
  return wa(e.tView, e.selectedIndex);
}
function x2() {
  return q.lFrame.currentNamespace;
}
var M2 = !0;
function ba() {
  return M2;
}
function hi(e) {
  M2 = e;
}
var td = { elements: void 0 };
function C2(e) {
  td.elements === void 0 && (td.elements = e);
}
function ui() {
  return td;
}
function nd(e, t = null, n = null, r) {
  let o = $d(e, t, n, r);
  return (o.resolveInjectorInitializers(), o);
}
function $d(e, t = null, n = null, r, o = new Set()) {
  let i = [n || Ke, q0(e)];
  return ((r = r || (typeof e == 'object' ? void 0 : en(e))), new Jn(i, t || Qr(), r || null, o));
}
var pe = class e {
    static THROW_IF_NOT_FOUND = Yn;
    static NULL = new Xo();
    static create(t, n) {
      if (Array.isArray(t)) return nd({ name: '' }, n, t, '');
      {
        let r = t.name ?? '';
        return nd({ name: r }, t.parent, t.providers, r);
      }
    }
    static ɵprov = y({ token: e, providedIn: 'any', factory: () => O(kd) });
    static __NG_ELEMENT_ID__ = -1;
  },
  de = new _(''),
  ht = (() => {
    class e {
      static __NG_ELEMENT_ID__ = k4;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  Jo = class extends ht {
    _lView;
    constructor(t) {
      (super(), (this._lView = t));
    }
    get destroyed() {
      return ir(this._lView);
    }
    onDestroy(t) {
      let n = this._lView;
      return (Rd(n, t), () => r2(n, t));
    }
  };
function k4() {
  return new Jo(K());
}
var it = class {
    _console = console;
    handleError(t) {
      this._console.error('ERROR', t);
    }
  },
  ut = new _('', {
    providedIn: 'root',
    factory: () => {
      let e = u(ke),
        t;
      return (n) => {
        e.destroyed && !t
          ? setTimeout(() => {
              throw n;
            })
          : ((t ??= e.get(it)), t.handleError(n));
      };
    },
  }),
  D2 = { provide: _n, useValue: () => void u(it), multi: !0 };
function Gd(e) {
  return typeof e == 'function' && e[Ae] !== void 0;
}
function W(e, t) {
  let [n, r, o] = Ic(e, t?.equal),
    i = n,
    s = i[Ae];
  return ((i.set = r), (i.update = o), (i.asReadonly = qd.bind(i)), i);
}
function qd() {
  let e = this[Ae];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    ((t[Ae] = e), (e.readonlyFn = t));
  }
  return e.readonlyFn;
}
function Wd(e) {
  return Gd(e) && typeof e.set == 'function';
}
var xt = class {},
  pi = new _('', { providedIn: 'root', factory: () => !1 });
var Zd = new _(''),
  Ea = new _('');
var oo = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      ((this.view = n), (this.node = r));
    }
    static __NG_ELEMENT_ID__ = y4;
  }
  return e;
})();
function y4() {
  return new oo(K(), ye());
}
var on = (() => {
  class e {
    taskId = 0;
    pendingTasks = new Set();
    destroyed = !1;
    pendingTask = new we(!1);
    get hasPendingTasks() {
      return this.destroyed ? !1 : this.pendingTask.value;
    }
    get hasPendingTasksObservable() {
      return this.destroyed
        ? new U((n) => {
            (n.next(!1), n.complete());
          })
        : this.pendingTask;
    }
    add() {
      !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
      let n = this.taskId++;
      return (this.pendingTasks.add(n), n);
    }
    has(n) {
      return this.pendingTasks.has(n);
    }
    remove(n) {
      (this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1));
    }
    ngOnDestroy() {
      (this.pendingTasks.clear(),
        this.hasPendingTasks && this.pendingTask.next(!1),
        (this.destroyed = !0),
        this.pendingTask.unsubscribe());
    }
    static ɵprov = y({ token: e, providedIn: 'root', factory: () => new e() });
  }
  return e;
})();
function ar(...e) {}
var gi = (() => {
    class e {
      static ɵprov = y({ token: e, providedIn: 'root', factory: () => new rd() });
    }
    return e;
  })(),
  rd = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(t) {
      (this.enqueue(t), this.schedule(t));
    }
    schedule(t) {
      t.dirty && this.dirtyEffectCount++;
    }
    remove(t) {
      let n = t.zone,
        r = this.queues.get(n);
      r.has(t) && (r.delete(t), t.dirty && this.dirtyEffectCount--);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || r.add(t);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let t = !1;
        for (let [n, r] of this.queues)
          n === null ? (t ||= this.flushQueue(r)) : (t ||= n.run(() => this.flushQueue(r)));
        t || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(t) {
      let n = !1;
      for (let r of t) r.dirty && (this.dirtyEffectCount--, (n = !0), r.run());
      return n;
    }
  };
function po(e) {
  return { toString: e }.toString();
}
var Sa = '__parameters__';
function I4(e) {
  return function (...n) {
    if (e) {
      let r = e(...n);
      for (let o in r) this[o] = r[o];
    }
  };
}
function i1(e, t, n) {
  return po(() => {
    let r = I4(t);
    function o(...i) {
      if (this instanceof o) return (r.apply(this, i), this);
      let s = new o(...i);
      return ((a.annotation = s), a);
      function a(l, c, d) {
        let h = l.hasOwnProperty(Sa) ? l[Sa] : Object.defineProperty(l, Sa, { value: [] })[Sa];
        for (; h.length <= d; ) h.push(null);
        return ((h[d] = h[d] || []).push(s), l);
      }
    }
    return ((o.prototype.ngMetadataName = e), (o.annotationCls = o), o);
  });
}
var Ah = wd(i1('Optional'), 8);
var s1 = wd(i1('SkipSelf'), 4);
function T4(e) {
  return typeof e == 'function';
}
var Oa = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    ((this.previousValue = t), (this.currentValue = n), (this.firstChange = r));
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function a1(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var Et = (() => {
  let e = () => l1;
  return ((e.ngInherit = !0), e);
})();
function l1(e) {
  return (e.type.prototype.ngOnChanges && (e.setInput = R4), A4);
}
function A4() {
  let e = d1(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === yn) e.previous = t;
    else for (let r in t) n[r] = t[r];
    ((e.current = null), this.ngOnChanges(t));
  }
}
function R4(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = d1(e) || P4(e, { previous: yn, current: null }),
    a = s.current || (s.current = {}),
    l = s.previous,
    c = l[i];
  ((a[i] = new Oa(c && c.currentValue, n, l === yn)), a1(e, t, o, n));
}
var c1 = '__ngSimpleChanges__';
function d1(e) {
  return e[c1] || null;
}
function P4(e, t) {
  return (e[c1] = t);
}
var b2 = [];
var re = function (e, t = null, n) {
  for (let r = 0; r < b2.length; r++) {
    let o = b2[r];
    o(e, t, n);
  }
};
function O4(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = l1(t);
    ((n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s));
  }
  (o && (n.preOrderHooks ??= []).push(0 - e, o),
    i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i)));
}
function h1(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: l,
        ngAfterViewChecked: c,
        ngOnDestroy: d,
      } = i;
    (s && (e.contentHooks ??= []).push(-n, s),
      a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)),
      l && (e.viewHooks ??= []).push(-n, l),
      c && ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      d != null && (e.destroyHooks ??= []).push(n, d));
  }
}
function Ta(e, t, n) {
  u1(e, t, 3, n);
}
function Aa(e, t, n, r) {
  (e[N] & 3) === n && u1(e, t, n, r);
}
function Yd(e, t) {
  let n = e[N];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[N] = n));
}
function u1(e, t, n, r) {
  let o = r !== void 0 ? e[nr] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let l = o; l < s; l++)
    if (typeof t[l + 1] == 'number') {
      if (((a = t[l]), r != null && a >= r)) break;
    } else
      (t[l] < 0 && (e[nr] += 65536),
        (a < i || i == -1) && (N4(e, n, t, l), (e[nr] = (e[nr] & 4294901760) + l + 2)),
        l++);
}
function E2(e, t) {
  re(4, e, t);
  let n = V(null);
  try {
    t.call(e);
  } finally {
    (V(n), re(5, e, t));
  }
}
function N4(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o ? e[N] >> 14 < e[nr] >> 16 && (e[N] & 3) === t && ((e[N] += 16384), E2(a, i)) : E2(a, i);
}
var so = -1,
  cr = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r, o) {
      ((this.factory = t), (this.name = o), (this.canSeeViewProviders = n), (this.injectImpl = r));
    }
  };
function j4(e) {
  return (e.flags & 8) !== 0;
}
function B4(e) {
  return (e.flags & 16) !== 0;
}
function L4(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == 'number') {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      (F4(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++);
    }
  }
  return r;
}
function p1(e) {
  return e === 3 || e === 4 || e === 6;
}
function F4(e) {
  return e.charCodeAt(0) === 64;
}
function wi(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == 'number'
          ? (n = o)
          : n === 0 || (n === -1 || n === 2 ? S2(e, n, o, null, t[++r]) : S2(e, n, o, null, null));
      }
    }
  return e;
}
function S2(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == 'number') {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == 'number') break;
    if (a === n) {
      o !== null && (e[i + 1] = o);
      return;
    }
    (i++, o !== null && i++);
  }
  (s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o));
}
function g1(e) {
  return e !== so;
}
function Na(e) {
  return e & 32767;
}
function V4(e) {
  return e >> 16;
}
function ja(e, t) {
  let n = V4(e),
    r = t;
  for (; n > 0; ) ((r = r[tr]), n--);
  return r;
}
var ih = !0;
function I2(e) {
  let t = ih;
  return ((ih = e), t);
}
var H4 = 256,
  f1 = H4 - 1,
  v1 = 5,
  U4 = 0,
  zt = {};
function z4(e, t, n) {
  let r;
  (typeof n == 'string' ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(er) && (r = n[er]),
    r == null && (r = n[er] = U4++));
  let o = r & f1,
    i = 1 << o;
  t.data[e + (o >> v1)] |= i;
}
function Ba(e, t) {
  let n = w1(e, t);
  if (n !== -1) return n;
  let r = t[B];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length), Kd(r.data, e), Kd(t, null), Kd(r.blueprint, null));
  let o = Rh(e, t),
    i = e.injectorIndex;
  if (g1(o)) {
    let s = Na(o),
      a = ja(o, t),
      l = a[B].data;
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | l[s + c];
  }
  return ((t[i + 8] = o), i);
}
function Kd(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function w1(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Rh(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = x1(o)), r === null)) return so;
    if ((n++, (o = o[tr]), r.injectorIndex !== -1)) return r.injectorIndex | (n << 16);
  }
  return so;
}
function sh(e, t, n) {
  z4(e, t, n);
}
function $4(e, t) {
  if (t === 'class') return e.classes;
  if (t === 'style') return e.styles;
  let n = e.attrs;
  if (n) {
    let r = n.length,
      o = 0;
    for (; o < r; ) {
      let i = n[o];
      if (p1(i)) break;
      if (i === 0) o = o + 2;
      else if (typeof i == 'number') for (o++; o < r && typeof n[o] == 'string'; ) o++;
      else {
        if (i === t) return n[o + 1];
        o = o + 2;
      }
    }
  }
  return null;
}
function m1(e, t, n) {
  if (n & 8 || e !== void 0) return e;
  pa(t, 'NodeInjector');
}
function k1(e, t, n, r) {
  if ((n & 8 && r === void 0 && (r = null), (n & 3) === 0)) {
    let o = e[Ft],
      i = Ye(void 0);
    try {
      return o ? o.get(t, r, n & 8) : vd(t, r, n & 8);
    } finally {
      Ye(i);
    }
  }
  return m1(r, t, n);
}
function y1(e, t, n, r = 0, o) {
  if (e !== null) {
    if (t[N] & 2048 && !(r & 2)) {
      let s = Z4(e, t, n, r, zt);
      if (s !== zt) return s;
    }
    let i = _1(e, t, n, r, zt);
    if (i !== zt) return i;
  }
  return k1(t, n, r, o);
}
function _1(e, t, n, r, o) {
  let i = q4(n);
  if (typeof i == 'function') {
    if (!Ud(t, e, r)) return r & 1 ? m1(o, n, r) : k1(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) pa(n);
      else return s;
    } finally {
      zd();
    }
  } else if (typeof i == 'number') {
    let s = null,
      a = w1(e, t),
      l = so,
      c = r & 1 ? t[lt][at] : null;
    for (
      (a === -1 || r & 4) &&
      ((l = a === -1 ? Rh(e, t) : t[a + 8]),
      l === so || !A2(r, !1) ? (a = -1) : ((s = t[B]), (a = Na(l)), (t = ja(l, t))));
      a !== -1;

    ) {
      let d = t[B];
      if (T2(i, a, d.data)) {
        let h = G4(a, t, n, s, r, c);
        if (h !== zt) return h;
      }
      ((l = t[a + 8]),
        l !== so && A2(r, t[B].data[a + 8] === c) && T2(i, a, t)
          ? ((s = d), (a = Na(l)), (t = ja(l, t)))
          : (a = -1));
    }
  }
  return o;
}
function G4(e, t, n, r, o, i) {
  let s = t[B],
    a = s.data[e + 8],
    l = r == null ? Cn(a) && ih : r != s && (a.type & 3) !== 0,
    c = o & 1 && i === a,
    d = Ra(a, s, n, l, c);
  return d !== null ? mi(t, s, d, a, o) : zt;
}
function Ra(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    l = e.directiveStart,
    c = e.directiveEnd,
    d = i >> 20,
    h = r ? a : a + d,
    g = o ? a + d : c;
  for (let p = h; p < g; p++) {
    let x = s[p];
    if ((p < l && n === x) || (p >= l && x.type === n)) return p;
  }
  if (o) {
    let p = s[l];
    if (p && Ut(p) && p.type === n) return l;
  }
  return null;
}
function mi(e, t, n, r, o) {
  let i = e[n],
    s = t.data;
  if (i instanceof cr) {
    let a = i;
    if (a.resolving) {
      let p = ca(s[n]);
      throw fd(p);
    }
    let l = I2(a.canSeeViewProviders);
    a.resolving = !0;
    let c = s[n].type || s[n],
      d,
      h = a.injectImpl ? Ye(a.injectImpl) : null,
      g = Ud(e, r, 0);
    try {
      ((i = e[n] = a.factory(void 0, o, s, e, r)),
        t.firstCreatePass && n >= r.directiveStart && O4(n, s[n], t));
    } finally {
      (h !== null && Ye(h), I2(l), (a.resolving = !1), zd());
    }
  }
  return i;
}
function q4(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(er) ? e[er] : void 0;
  return typeof t == 'number' ? (t >= 0 ? t & f1 : W4) : t;
}
function T2(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> v1)] & r);
}
function A2(e, t) {
  return !(e & 2) && !(e & 1 && t);
}
var lr = class {
  _tNode;
  _lView;
  constructor(t, n) {
    ((this._tNode = t), (this._lView = n));
  }
  get(t, n, r) {
    return y1(this._tNode, this._lView, t, Kn(r), n);
  }
};
function W4() {
  return new lr(ye(), K());
}
function Tn(e) {
  return po(() => {
    let t = e.prototype.constructor,
      n = t[Qo] || ah(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[Qo] || ah(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function ah(e) {
  return sd(e)
    ? () => {
        let t = ah(Ee(e));
        return t && t();
      }
    : Qn(e);
}
function Z4(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[N] & 2048 && !to(s); ) {
    let a = _1(i, s, n, r | 2, zt);
    if (a !== zt) return a;
    let l = i.parent;
    if (!l) {
      let c = s[Ed];
      if (c) {
        let d = c.get(n, zt, r);
        if (d !== zt) return d;
      }
      ((l = x1(s)), (s = s[tr]));
    }
    i = l;
  }
  return o;
}
function x1(e) {
  let t = e[B],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[at] : null;
}
function Ph(e) {
  return $4(ye(), e);
}
function Y4() {
  return go(ye(), K());
}
function go(e, t) {
  return new ge(Xe(e, t));
}
var ge = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = Y4;
  }
  return e;
})();
function K4(e) {
  return e instanceof ge ? e.nativeElement : e;
}
function Q4() {
  return this._results[Symbol.iterator]();
}
var La = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new P());
  }
  constructor(t = !1) {
    this._emitDistinctChangesOnly = t;
  }
  get(t) {
    return this._results[t];
  }
  map(t) {
    return this._results.map(t);
  }
  filter(t) {
    return this._results.filter(t);
  }
  find(t) {
    return this._results.find(t);
  }
  reduce(t, n) {
    return this._results.reduce(t, n);
  }
  forEach(t) {
    this._results.forEach(t);
  }
  some(t) {
    return this._results.some(t);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(t, n) {
    this.dirty = !1;
    let r = U0(t);
    (this._changesDetected = !H0(this._results, r, n)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(t) {
    this._onDirty = t;
  }
  setDirty() {
    ((this.dirty = !0), this._onDirty?.());
  }
  destroy() {
    this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = Q4;
};
function M1(e) {
  return (e.flags & 128) === 128;
}
var Oh = (function (e) {
    return ((e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e);
  })(Oh || {}),
  C1 = new Map(),
  X4 = 0;
function J4() {
  return X4++;
}
function ek(e) {
  C1.set(e[ii], e);
}
function lh(e) {
  C1.delete(e[ii]);
}
var R2 = '__ngContext__';
function co(e, t) {
  Ht(t) ? ((e[R2] = t[ii]), ek(t)) : (e[R2] = t);
}
function D1(e) {
  return E1(e[Jr]);
}
function b1(e) {
  return E1(e[st]);
}
function E1(e) {
  for (; e !== null && !Dt(e); ) e = e[st];
  return e;
}
var ch;
function Nh(e) {
  ch = e;
}
function S1() {
  if (ch !== void 0) return ch;
  if (typeof document < 'u') return document;
  throw new b(210, !1);
}
var fo = new _('', { providedIn: 'root', factory: () => tk }),
  tk = 'ng',
  Ka = new _(''),
  qt = new _('', { providedIn: 'platform', factory: () => 'unknown' });
var Qa = new _('', {
  providedIn: 'root',
  factory: () => S1().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
});
var nk = 'h',
  rk = 'b';
var I1 = !1,
  T1 = new _('', { providedIn: 'root', factory: () => I1 });
var ok = (e, t, n, r) => {};
function ik(e, t, n, r) {
  ok(e, t, n, r);
}
function jh(e) {
  return (e.flags & 32) === 32;
}
var sk = () => null;
function A1(e, t, n = !1) {
  return sk(e, t, n);
}
function R1(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = V(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          (xa(i), a.contentQueries(2, t[s], s));
        }
      }
    } finally {
      V(r);
    }
  }
}
function dh(e, t, n) {
  xa(0);
  let r = V(null);
  try {
    t(e, n);
  } finally {
    V(r);
  }
}
function Bh(e, t, n) {
  if (Sd(t)) {
    let r = V(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let l = n[s];
          a.contentQueries(1, l, s);
        }
      }
    } finally {
      V(r);
    }
  }
}
var ln = (function (e) {
  return (
    (e[(e.Emulated = 0)] = 'Emulated'),
    (e[(e.None = 2)] = 'None'),
    (e[(e.ShadowDom = 3)] = 'ShadowDom'),
    e
  );
})(ln || {});
var hh = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${od})`;
  }
};
function P1(e) {
  return e instanceof hh ? e.changingThisBreaksApplicationSecurity : e;
}
var ak = /^>|^->|<!--|-->|--!>|<!-$/g,
  lk = /(<|>)/g,
  ck = '\u200B$1\u200B';
function dk(e) {
  return e.replace(ak, (t) => t.replace(lk, ck));
}
function Lh(e) {
  return e.ownerDocument.defaultView;
}
function Fh(e) {
  return e.ownerDocument;
}
function O1(e) {
  return e instanceof Function ? e() : e;
}
function hk(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var N1 = 'ng-template';
function uk(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == 'string'; o += 2)
      if (t[o] === 'class' && hk(t[o + 1].toLowerCase(), n, 0) !== -1) return !0;
  } else if (Vh(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == 'string'; ) if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function Vh(e) {
  return e.type === 4 && e.value !== N1;
}
function pk(e, t, n) {
  let r = e.type === 4 && !n ? N1 : e.value;
  return t === r;
}
function gk(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? wk(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let l = t[a];
    if (typeof l == 'number') {
      if (!s && !bt(r) && !bt(l)) return !1;
      if (s && bt(l)) continue;
      ((s = !1), (r = l | (r & 1)));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (((r = 2 | (r & 1)), (l !== '' && !pk(e, l, n)) || (l === '' && t.length === 1))) {
          if (bt(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !uk(e, o, l, n)) {
          if (bt(r)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          d = fk(l, o, Vh(e), n);
        if (d === -1) {
          if (bt(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== '') {
          let h;
          if ((d > i ? (h = '') : (h = o[d + 1].toLowerCase()), r & 2 && c !== h)) {
            if (bt(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return bt(r) || s;
}
function bt(e) {
  return (e & 1) === 0;
}
function fk(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == 'string'; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return mk(t, e);
}
function vk(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (gk(e, t[r], n)) return !0;
  return !1;
}
function wk(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (p1(n)) return t;
  }
  return e.length;
}
function mk(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == 'number') return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function P2(e, t) {
  return e ? ':not(' + t.trim() + ')' : t;
}
function kk(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = '',
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n];
        o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else r & 8 ? (o += '.' + s) : r & 4 && (o += ' ' + s);
    else (o !== '' && !bt(s) && ((t += P2(i, o)), (o = '')), (r = s), (i = i || !bt(r)));
    n++;
  }
  return (o !== '' && (t += P2(i, o)), t);
}
function yk(e) {
  return e.map(kk).join(',');
}
function _k(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == 'string') o === 2 ? i !== '' && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!bt(o)) break;
      o = i;
    }
    r++;
  }
  return (n.length && t.push(1, ...n), t);
}
var cn = {};
function xk(e, t) {
  return e.createText(t);
}
function Mk(e, t, n) {
  e.setValue(t, n);
}
function Ck(e, t) {
  return e.createComment(dk(t));
}
function j1(e, t, n) {
  return e.createElement(t, n);
}
function Fa(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function B1(e, t, n) {
  e.appendChild(t, n);
}
function O2(e, t, n, r, o) {
  r !== null ? Fa(e, t, n, r, o) : B1(e, t, n);
}
function Dk(e, t, n) {
  e.removeChild(null, t, n);
}
function bk(e, t, n) {
  e.setAttribute(t, 'style', n);
}
function Ek(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n);
}
function L1(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  (r !== null && L4(e, t, r), o !== null && Ek(e, t, o), i !== null && bk(e, t, i));
}
function Hh(e, t, n, r, o, i, s, a, l, c, d) {
  let h = Ge + r,
    g = h + o,
    p = Sk(h, g),
    x = typeof c == 'function' ? c() : c;
  return (p[B] = {
    type: e,
    blueprint: p,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: p.slice().fill(null, h),
    bindingStartIndex: h,
    expandoStartIndex: g,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == 'function' ? i() : i,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: l,
    consts: x,
    incompleteFirstPass: !1,
    ssrId: d,
  });
}
function Sk(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : cn);
  return n;
}
function Ik(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Hh(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function Uh(e, t, n, r, o, i, s, a, l, c, d) {
  let h = t.blueprint.slice();
  return (
    (h[Ct] = o),
    (h[N] = r | 4 | 128 | 8 | 64 | 1024),
    (c !== null || (e && e[N] & 2048)) && (h[N] |= 2048),
    Td(h),
    (h[Me] = h[tr] = e),
    (h[Oe] = n),
    (h[nn] = s || (e && e[nn])),
    (h[ae] = a || (e && e[ae])),
    (h[Ft] = l || (e && e[Ft]) || null),
    (h[at] = i),
    (h[ii] = J4()),
    (h[oi] = d),
    (h[Ed] = c),
    (h[lt] = t.type == 2 ? e[lt] : h),
    h
  );
}
function Tk(e, t, n) {
  let r = Xe(t, e),
    o = Ik(n),
    i = e[nn].rendererFactory,
    s = zh(e, Uh(e, o, null, F1(n), r, t, null, i.createRenderer(r, n), null, null, null));
  return (e[t.index] = s);
}
function F1(e) {
  let t = 16;
  return (e.signals ? (t = 4096) : e.onPush && (t = 64), t);
}
function V1(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) (t.push(r), e.blueprint.push(r), e.data.push(null));
  return o;
}
function zh(e, t) {
  return (e[Jr] ? (e[bd][st] = t) : (e[Jr] = t), (e[bd] = t), t);
}
function m(e = 1) {
  H1(Ie(), K(), sr() + e, !1);
}
function H1(e, t, n, r) {
  if (!r)
    if ((t[N] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Ta(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Aa(t, i, 0, n);
    }
  bn(n);
}
var Xa = (function (e) {
  return (
    (e[(e.None = 0)] = 'None'),
    (e[(e.SignalBased = 1)] = 'SignalBased'),
    (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
    e
  );
})(Xa || {});
function uh(e, t, n, r) {
  let o = V(null);
  try {
    let [i, s, a] = e.inputs[n],
      l = null;
    ((s & Xa.SignalBased) !== 0 && (l = t[i][Ae]),
      l !== null && l.transformFn !== void 0
        ? (r = l.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, l, r, n, i) : a1(t, l, i, r));
  } finally {
    V(o);
  }
}
var $t = (function (e) {
    return ((e[(e.Important = 1)] = 'Important'), (e[(e.DashCase = 2)] = 'DashCase'), e);
  })($t || {}),
  Ak;
function $h(e, t) {
  return Ak(e, t);
}
function io(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    Dt(r) ? (i = r) : Ht(r) && ((s = !0), (r = r[Ct]));
    let a = ct(r);
    (e === 0 && n !== null
      ? o == null
        ? B1(t, n, a)
        : Fa(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? Fa(t, n, a, o || null, !0)
        : e === 2
          ? Dk(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && zk(t, e, i, n, o));
  }
}
function Rk(e, t) {
  (U1(e, t), (t[Ct] = null), (t[at] = null));
}
function Pk(e, t, n, r, o, i) {
  ((r[Ct] = o), (r[at] = t), Ja(e, r, n, 1, o, i));
}
function U1(e, t) {
  (t[nn].changeDetectionScheduler?.notify(9), Ja(e, t, t[ae], 2, null, null));
}
function Ok(e) {
  let t = e[Jr];
  if (!t) return Qd(e[B], e);
  for (; t; ) {
    let n = null;
    if (Ht(t)) n = t[Jr];
    else {
      let r = t[Le];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[st] && t !== e; ) (Ht(t) && Qd(t[B], t), (t = t[Me]));
      (t === null && (t = e), Ht(t) && Qd(t[B], t), (n = t && t[st]));
    }
    t = n;
  }
}
function Gh(e, t) {
  let n = e[or],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function z1(e, t) {
  if (ir(t)) return;
  let n = t[ae];
  (n.destroyNode && Ja(e, t, n, 3, null, null), Ok(t));
}
function Qd(e, t) {
  if (ir(t)) return;
  let n = V(null);
  try {
    ((t[N] &= -129),
      (t[N] |= 256),
      t[Qe] && zn(t[Qe]),
      jk(e, t),
      Nk(e, t),
      t[B].type === 1 && t[ae].destroy());
    let r = t[xn];
    if (r !== null && Dt(t[Me])) {
      r !== t[Me] && Gh(r, t);
      let o = t[Vt];
      o !== null && o.detachView(e);
    }
    lh(t);
  } finally {
    V(n);
  }
}
function Nk(e, t) {
  let n = e.cleanup,
    r = t[Xr];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let a = n[s + 3];
        (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[Xr] = null);
  let o = t[Jt];
  if (o !== null) {
    t[Jt] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[rn];
  if (i !== null) {
    t[rn] = null;
    for (let s of i) s.destroy();
  }
}
function jk(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof cr)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              l = i[s + 1];
            re(4, a, l);
            try {
              l.call(a);
            } finally {
              re(5, a, l);
            }
          }
        else {
          re(4, o, i);
          try {
            i.call(o);
          } finally {
            re(5, o, i);
          }
        }
      }
    }
}
function Bk(e, t, n) {
  return Lk(e, t.parent, n);
}
function Lk(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) ((t = r), (r = t.parent));
  if (r === null) return n[Ct];
  if (Cn(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === ln.None || o === ln.Emulated) return null;
  }
  return Xe(r, n);
}
function Fk(e, t, n) {
  return Hk(e, t, n);
}
function Vk(e, t, n) {
  return e.type & 40 ? Xe(e, n) : null;
}
var Hk = Vk,
  N2;
function qh(e, t, n, r) {
  let o = Bk(e, r, t),
    i = t[ae],
    s = r.parent || t[at],
    a = Fk(s, r, t);
  if (o != null)
    if (Array.isArray(n)) for (let l = 0; l < n.length; l++) O2(i, o, n[l], a, !1);
    else O2(i, o, n, a, !1);
  N2 !== void 0 && N2(i, r, t, n, o);
}
function fi(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return Xe(t, e);
    if (n & 4) return ph(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return fi(e, r);
      {
        let o = e[t.index];
        return Dt(o) ? ph(-1, o) : ct(o);
      }
    } else {
      if (n & 128) return fi(e, t.next);
      if (n & 32) return $h(t, e)() || ct(e[t.index]);
      {
        let r = $1(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = kn(e[lt]);
          return fi(o, r);
        } else return fi(e, t.next);
      }
    }
  }
  return null;
}
function $1(e, t) {
  if (t !== null) {
    let r = e[lt][at],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function ph(e, t) {
  let n = Le + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[B].firstChild;
    if (o !== null) return fi(r, o);
  }
  return t[Mn];
}
function Wh(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      l = n.type;
    if ((s && t === 0 && (a && co(ct(a), r), (n.flags |= 2)), !jh(n)))
      if (l & 8) (Wh(e, t, n.child, r, o, i, !1), io(t, e, o, a, i));
      else if (l & 32) {
        let c = $h(n, r),
          d;
        for (; (d = c()); ) io(t, e, o, d, i);
        io(t, e, o, a, i);
      } else l & 16 ? Uk(e, t, r, n, o, i) : io(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Ja(e, t, n, r, o, i) {
  Wh(n, r, e.firstChild, t, o, i, !1);
}
function Uk(e, t, n, r, o, i) {
  let s = n[lt],
    l = s[at].projection[r.projection];
  if (Array.isArray(l))
    for (let c = 0; c < l.length; c++) {
      let d = l[c];
      io(t, e, o, d, i);
    }
  else {
    let c = l,
      d = s[Me];
    (M1(r) && (c.flags |= 128), Wh(e, t, c, d, o, i, !0));
  }
}
function zk(e, t, n, r, o) {
  let i = n[Mn],
    s = ct(n);
  i !== s && io(t, e, r, i, o);
  for (let a = Le; a < n.length; a++) {
    let l = n[a];
    Ja(l[B], l, e, t, r, i);
  }
}
function $k(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf('-') === -1 ? void 0 : $t.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == 'string' &&
          o.endsWith('!important') &&
          ((o = o.slice(0, -10)), (i |= $t.Important)),
        e.setStyle(n, r, o, i));
  }
}
function G1(e, t, n, r, o) {
  let i = sr(),
    s = r & 2;
  try {
    (bn(-1), s && t.length > Ge && H1(e, t, Ge, !1), re(s ? 2 : 0, o, n), n(r, o));
  } finally {
    (bn(i), re(s ? 3 : 1, o, n));
  }
}
function el(e, t, n) {
  (Qk(e, t, n), (n.flags & 64) === 64 && Xk(e, t, n));
}
function Zh(e, t, n = Xe) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Gk(e, t, n, r) {
  let i = r.get(T1, I1) || n === ln.ShadowDom,
    s = e.selectRootElement(t, i);
  return (qk(s), s);
}
function qk(e) {
  Wk(e);
}
var Wk = () => null;
function Zk(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
      ? 'htmlFor'
      : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
          ? 'innerHTML'
          : e === 'readonly'
            ? 'readOnly'
            : e === 'tabindex'
              ? 'tabIndex'
              : e;
}
function q1(e, t, n, r, o, i) {
  let s = t[B];
  if (Kh(e, s, t, n, r)) {
    Cn(e) && Kk(t, e.index);
    return;
  }
  (e.type & 3 && (n = Zk(n)), Yk(e, t, n, r, o, i));
}
function Yk(e, t, n, r, o, i) {
  if (e.type & 3) {
    let s = Xe(e, t);
    ((r = i != null ? i(r, e.value || '', n) : r), o.setProperty(s, n, r));
  } else e.type & 12;
}
function Kk(e, t) {
  let n = dt(t, e);
  n[N] & 16 || (n[N] |= 64);
}
function Qk(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd;
  (Cn(n) && Tk(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Ba(n, t));
  let i = n.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      l = mi(t, e, s, n);
    if ((co(l, t), i !== null && ny(t, s - r, l, a, n, i), Ut(a))) {
      let c = dt(n.index, t);
      c[Oe] = mi(t, e, s, n);
    }
  }
}
function Xk(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = v2();
  try {
    bn(i);
    for (let a = r; a < o; a++) {
      let l = e.data[a],
        c = t[a];
      (_a(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && Jk(l, c));
    }
  } finally {
    (bn(-1), _a(s));
  }
}
function Jk(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Yh(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let i = n[o];
      vk(t, i.selectors, !1) && ((r ??= []), Ut(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function ey(e, t, n, r, o, i) {
  let s = Xe(e, t);
  ty(t[ae], s, i, e.value, n, r, o);
}
function ty(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? ua(i) : s(i, r || '', o);
    e.setAttribute(t, o, a, n);
  }
}
function ny(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let l = s[a],
        c = s[a + 1];
      uh(r, n, l, c);
    }
}
function W1(e, t, n, r, o) {
  let i = Ge + n,
    s = t[B],
    a = o(s, t, e, r, n);
  ((t[i] = a), no(e, !0));
  let l = e.type === 2;
  return (
    l ? (L1(t[ae], a, e), (o2() === 0 || eo(e)) && co(a, t), i2()) : co(a, t),
    ba() && (!l || !jh(e)) && qh(s, t, a, e),
    e
  );
}
function Z1(e) {
  let t = e;
  return (Bd() ? h2() : ((t = t.parent), no(t, !1)), t);
}
function ry(e, t) {
  let n = e[Ft];
  if (!n) return;
  n.get(ut, null)?.(t);
}
function Kh(e, t, n, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let l = 0; l < s.length; l += 2) {
      let c = s[l],
        d = s[l + 1],
        h = t.data[c];
      (uh(h, n[c], d, o), (a = !0));
    }
  if (i)
    for (let l of i) {
      let c = n[l],
        d = t.data[l];
      (uh(d, c, r, o), (a = !0));
    }
  return a;
}
function oy(e, t) {
  let n = dt(t, e),
    r = n[B];
  iy(r, n);
  let o = n[Ct];
  (o !== null && n[oi] === null && (n[oi] = A1(o, n[Ft])), re(18), Qh(r, n, n[Oe]), re(19, n[Oe]));
}
function iy(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Qh(e, t, n) {
  Ma(t);
  try {
    let r = e.viewQuery;
    r !== null && dh(1, r, n);
    let o = e.template;
    (o !== null && G1(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Vt]?.finishViewCreation(e),
      e.staticContentQueries && R1(e, t),
      e.staticViewQueries && dh(2, e.viewQuery, n));
    let i = e.components;
    i !== null && sy(t, i);
  } catch (r) {
    throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
  } finally {
    ((t[N] &= -5), Ca());
  }
}
function sy(e, t) {
  for (let n = 0; n < t.length; n++) oy(e, t[n]);
}
function ay(e, t, n, r) {
  let o = V(null);
  try {
    let i = t.tView,
      a = e[N] & 4096 ? 4096 : 16,
      l = Uh(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      c = e[t.index];
    l[xn] = c;
    let d = e[Vt];
    return (d !== null && (l[Vt] = d.createEmbeddedView(i)), Qh(i, l, n), l);
  } finally {
    V(o);
  }
}
function j2(e, t) {
  return !t || t.firstChild === null || M1(e);
}
var B2 = !1,
  ly = new _('');
function ki(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    (i !== null && r.push(ct(i)), Dt(i) && Y1(i, r));
    let s = n.type;
    if (s & 8) ki(e, t, n.child, r);
    else if (s & 32) {
      let a = $h(n, t),
        l;
      for (; (l = a()); ) r.push(l);
    } else if (s & 16) {
      let a = $1(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let l = kn(t[lt]);
        ki(l[B], l, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Y1(e, t) {
  for (let n = Le; n < e.length; n++) {
    let r = e[n],
      o = r[B].firstChild;
    o !== null && ki(r[B], r, o, t);
  }
  e[Mn] !== e[Ct] && t.push(e[Mn]);
}
function K1(e) {
  if (e[rr] !== null) {
    for (let t of e[rr]) t.impl.addSequence(t);
    e[rr].length = 0;
  }
}
var Q1 = [];
function cy(e) {
  return e[Qe] ?? dy(e);
}
function dy(e) {
  let t = Q1.pop() ?? Object.create(uy);
  return ((t.lView = e), t);
}
function hy(e) {
  e.lView[Qe] !== e && ((e.lView = null), Q1.push(e));
}
var uy = F(w({}, fn), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    Dn(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[Qe] = this;
  },
});
function py(e) {
  let t = e[Qe] ?? Object.create(gy);
  return ((t.lView = e), t);
}
var gy = F(w({}, fn), {
  consumerIsAlwaysLive: !0,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    let t = kn(e.lView);
    for (; t && !X1(t[B]); ) t = kn(t);
    t && Ad(t);
  },
  consumerOnSignalRead() {
    this.lView[Qe] = this;
  },
});
function X1(e) {
  return e.type !== 2;
}
function J1(e) {
  if (e[rn] === null) return;
  let t = !0;
  for (; t; ) {
    let n = !1;
    for (let r of e[rn])
      r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
    t = n && !!(e[N] & 8192);
  }
}
var fy = 100;
function Xh(e, t = 0) {
  let r = e[nn].rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    vy(e, t);
  } finally {
    o || r.end?.();
  }
}
function vy(e, t) {
  let n = Fd();
  try {
    (ro(!0), gh(e, t));
    let r = 0;
    for (; li(e); ) {
      if (r === fy) throw new b(103, !1);
      (r++, gh(e, 1));
    }
  } finally {
    ro(n);
  }
}
function eg(e, t) {
  Ld(t ? ci.Exhaustive : ci.OnlyDirtyViews);
  try {
    Xh(e);
  } finally {
    Ld(ci.Off);
  }
}
function wy(e, t, n, r) {
  if (ir(t)) return;
  let o = t[N],
    i = !1,
    s = !1;
  Ma(t);
  let a = !0,
    l = null,
    c = null;
  i ||
    (X1(e)
      ? ((c = cy(t)), (l = vn(c)))
      : Ds() === null
        ? ((a = !1), (c = py(t)), (l = vn(c)))
        : t[Qe] && (zn(t[Qe]), (t[Qe] = null)));
  try {
    (Td(t), u2(e.bindingStartIndex), n !== null && G1(e, t, n, 2, r));
    let d = (o & 3) === 3;
    if (!i)
      if (d) {
        let p = e.preOrderCheckHooks;
        p !== null && Ta(t, p, null);
      } else {
        let p = e.preOrderHooks;
        (p !== null && Aa(t, p, 0, null), Yd(t, 0));
      }
    if ((s || my(t), J1(t), tg(t, 0), e.contentQueries !== null && R1(e, t), !i))
      if (d) {
        let p = e.contentCheckHooks;
        p !== null && Ta(t, p);
      } else {
        let p = e.contentHooks;
        (p !== null && Aa(t, p, 1), Yd(t, 1));
      }
    yy(e, t);
    let h = e.components;
    h !== null && rg(t, h, 0);
    let g = e.viewQuery;
    if ((g !== null && dh(2, g, r), !i))
      if (d) {
        let p = e.viewCheckHooks;
        p !== null && Ta(t, p);
      } else {
        let p = e.viewHooks;
        (p !== null && Aa(t, p, 2), Yd(t, 2));
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[va])) {
      for (let p of t[va]) p();
      t[va] = null;
    }
    i || (K1(t), (t[N] &= -73));
  } catch (d) {
    throw (i || Dn(t), d);
  } finally {
    (c !== null && (Un(c, l), a && hy(c)), Ca());
  }
}
function tg(e, t) {
  for (let n = D1(e); n !== null; n = b1(n))
    for (let r = Le; r < n.length; r++) {
      let o = n[r];
      ng(o, t);
    }
}
function my(e) {
  for (let t = D1(e); t !== null; t = b1(t)) {
    if (!(t[N] & 2)) continue;
    let n = t[or];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      Ad(o);
    }
  }
}
function ky(e, t, n) {
  re(18);
  let r = dt(t, e);
  (ng(r, n), re(19, r[Oe]));
}
function ng(e, t) {
  ma(e) && gh(e, t);
}
function gh(e, t) {
  let r = e[B],
    o = e[N],
    i = e[Qe],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Ir(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[N] &= -9217),
    s)
  )
    wy(r, e, r.template, e[Oe]);
  else if (o & 8192) {
    let a = V(null);
    try {
      (J1(e), tg(e, 1));
      let l = r.components;
      (l !== null && rg(e, l, 1), K1(e));
    } finally {
      V(a);
    }
  }
}
function rg(e, t, n) {
  for (let r = 0; r < t.length; r++) ky(e, t[r], n);
}
function yy(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) bn(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          f2(s, i);
          let l = t[i];
          (re(24, l), a(2, l), re(25, l));
        }
      }
    } finally {
      bn(-1);
    }
}
function Jh(e, t) {
  let n = Fd() ? 64 : 1088;
  for (e[nn].changeDetectionScheduler?.notify(t); e; ) {
    e[N] |= n;
    let r = kn(e);
    if (to(e) && !r) return e;
    e = r;
  }
  return null;
}
function og(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function _y(e, t, n, r = !0) {
  let o = t[B];
  if ((xy(o, t, e, n), r)) {
    let s = ph(n, e),
      a = t[ae],
      l = a.parentNode(e[Mn]);
    l !== null && Pk(o, e[at], a, t, l, s);
  }
  let i = t[oi];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function fh(e, t) {
  if (e.length <= Le) return;
  let n = Le + t,
    r = e[n];
  if (r) {
    let o = r[xn];
    (o !== null && o !== e && Gh(o, r), t > 0 && (e[n - 1][st] = r[st]));
    let i = ti(e, Le + t);
    Rk(r[B], r);
    let s = i[Vt];
    (s !== null && s.detachView(i[B]), (r[Me] = null), (r[st] = null), (r[N] &= -129));
  }
  return r;
}
function xy(e, t, n, r) {
  let o = Le + r,
    i = n.length;
  (r > 0 && (n[o - 1][st] = t),
    r < i - Le ? ((t[st] = n[o]), md(n, Le + r, t)) : (n.push(t), (t[st] = null)),
    (t[Me] = n));
  let s = t[xn];
  s !== null && n !== s && ig(s, t);
  let a = t[Vt];
  (a !== null && a.insertView(e), ka(t), (t[N] |= 128));
}
function ig(e, t) {
  let n = e[or],
    r = t[Me];
  if (Ht(r)) e[N] |= 2;
  else {
    let o = r[Me][lt];
    t[lt] !== o && (e[N] |= 2);
  }
  n === null ? (e[or] = [t]) : n.push(t);
}
var Sn = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let t = this._lView,
      n = t[B];
    return ki(n, t, n.firstChild, []);
  }
  constructor(t, n) {
    ((this._lView = t), (this._cdRefInjectingView = n));
  }
  get context() {
    return this._lView[Oe];
  }
  set context(t) {
    this._lView[Oe] = t;
  }
  get destroyed() {
    return ir(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[Me];
      if (Dt(t)) {
        let n = t[si],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (fh(t, r), ti(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    z1(this._lView[B], this._lView);
  }
  onDestroy(t) {
    Rd(this._lView, t);
  }
  markForCheck() {
    Jh(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[N] &= -129;
  }
  reattach() {
    (ka(this._lView), (this._lView[N] |= 128));
  }
  detectChanges() {
    ((this._lView[N] |= 1024), Xh(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new b(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = to(this._lView),
      n = this._lView[xn];
    (n !== null && !t && Gh(n, this._lView), U1(this._lView[B], this._lView));
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new b(902, !1);
    this._appRef = t;
    let n = to(this._lView),
      r = this._lView[xn];
    (r !== null && !n && ig(r, this._lView), ka(this._lView));
  }
};
var Gt = (() => {
  class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = My;
    constructor(n, r, o) {
      ((this._declarationLView = n), (this._declarationTContainer = r), (this.elementRef = o));
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, r) {
      return this.createEmbeddedViewImpl(n, r);
    }
    createEmbeddedViewImpl(n, r, o) {
      let i = ay(this._declarationLView, this._declarationTContainer, n, {
        embeddedViewInjector: r,
        dehydratedView: o,
      });
      return new Sn(i);
    }
  }
  return e;
})();
function My() {
  return eu(ye(), K());
}
function eu(e, t) {
  return e.type & 4 ? new Gt(t, e, go(e, t)) : null;
}
function tu(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) ((i = Cy(e, t, n, r, o)), g2() && (i.flags |= 32));
  else if (i.type & 64) {
    ((i.type = n), (i.value = r), (i.attrs = o));
    let s = d2();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (no(i, !0), i);
}
function Cy(e, t, n, r, o) {
  let i = jd(),
    s = Bd(),
    a = s ? i : i && i.parent,
    l = (e.data[t] = by(e, a, n, t, r, o));
  return (Dy(e, l, i, s), l);
}
function Dy(e, t, n, r) {
  (e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n))));
}
function by(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    a2() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var hT = new RegExp(`^(\\d+)*(${rk}|${nk})*(.*)`);
var Ey = () => null;
function L2(e, t) {
  return Ey(e, t);
}
var sg = class {},
  tl = class {},
  vh = class {
    resolveComponentFactory(t) {
      throw new b(917, !1);
    }
  },
  Mi = class {
    static NULL = new vh();
  },
  Je = class {},
  pt = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => Sy();
    }
    return e;
  })();
function Sy() {
  let e = K(),
    t = ye(),
    n = dt(t.index, e);
  return (Ht(n) ? n : e)[ae];
}
var ag = (() => {
  class e {
    static ɵprov = y({ token: e, providedIn: 'root', factory: () => null });
  }
  return e;
})();
var Pa = {},
  wh = class {
    injector;
    parentInjector;
    constructor(t, n) {
      ((this.injector = t), (this.parentInjector = n));
    }
    get(t, n, r) {
      let o = this.injector.get(t, Pa, r);
      return o !== Pa || n === Pa ? o : this.parentInjector.get(t, n, r);
    }
  };
function F2(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == 'number') i = a;
      else if (i == 1) o = id(o, a);
      else if (i == 2) {
        let l = a,
          c = t[++s];
        r = id(r, l + ': ' + c + ';');
      }
    }
  (n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o));
}
function I(e, t = 0) {
  let n = K();
  if (n === null) return O(e, t);
  let r = ye();
  return y1(r, n, Ee(e), t);
}
function lg(e, t, n, r, o) {
  let i = r === null ? null : { '': -1 },
    s = o(e, n);
  if (s !== null) {
    let a = s,
      l = null,
      c = null;
    for (let d of s)
      if (d.resolveHostDirectives !== null) {
        [a, l, c] = d.resolveHostDirectives(s);
        break;
      }
    Ay(e, t, n, a, i, l, c);
  }
  i !== null && r !== null && Iy(n, r, i);
}
function Iy(e, t, n) {
  let r = (e.localNames = []);
  for (let o = 0; o < t.length; o += 2) {
    let i = n[t[o + 1]];
    if (i == null) throw new b(-301, !1);
    r.push(t[o], i);
  }
}
function Ty(e, t, n) {
  ((t.componentOffset = n), (e.components ??= []).push(t.index));
}
function Ay(e, t, n, r, o, i, s) {
  let a = r.length,
    l = !1;
  for (let g = 0; g < a; g++) {
    let p = r[g];
    (!l && Ut(p) && ((l = !0), Ty(e, n, g)), sh(Ba(n, t), e, p.type));
  }
  By(n, e.data.length, a);
  for (let g = 0; g < a; g++) {
    let p = r[g];
    p.providersResolver && p.providersResolver(p);
  }
  let c = !1,
    d = !1,
    h = V1(e, t, a, null);
  a > 0 && (n.directiveToIndex = new Map());
  for (let g = 0; g < a; g++) {
    let p = r[g];
    if (
      ((n.mergedAttrs = wi(n.mergedAttrs, p.hostAttrs)),
      Py(e, n, t, h, p),
      jy(h, p, o),
      s !== null && s.has(p))
    ) {
      let [R, L] = s.get(p);
      n.directiveToIndex.set(p.type, [h, R + n.directiveStart, L + n.directiveStart]);
    } else (i === null || !i.has(p)) && n.directiveToIndex.set(p.type, h);
    (p.contentQueries !== null && (n.flags |= 4),
      (p.hostBindings !== null || p.hostAttrs !== null || p.hostVars !== 0) && (n.flags |= 64));
    let x = p.type.prototype;
    (!c &&
      (x.ngOnChanges || x.ngOnInit || x.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (c = !0)),
      !d &&
        (x.ngOnChanges || x.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (d = !0)),
      h++);
  }
  Ry(e, n, i);
}
function Ry(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let o = e.data[r];
    if (n === null || !n.has(o)) (V2(0, t, o, r), V2(1, t, o, r), U2(t, r, !1));
    else {
      let i = n.get(o);
      (H2(0, t, i, r), H2(1, t, i, r), U2(t, r, !0));
    }
  }
}
function V2(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      (e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        cg(t, i));
    }
}
function H2(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      (e === 0 ? (a = t.hostDirectiveInputs ??= {}) : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        cg(t, s));
    }
}
function cg(e, t) {
  t === 'class' ? (e.flags |= 8) : t === 'style' && (e.flags |= 16);
}
function U2(e, t, n) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!n && o === null) || (n && i === null) || Vh(e)) {
    ((e.initialInputs ??= []), e.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let l = r[a];
    if (l === 0) {
      a += 4;
      continue;
    } else if (l === 5) {
      a += 2;
      continue;
    } else if (typeof l == 'number') break;
    if (!n && o.hasOwnProperty(l)) {
      let c = o[l];
      for (let d of c)
        if (d === t) {
          ((s ??= []), s.push(l, r[a + 1]));
          break;
        }
    } else if (n && i.hasOwnProperty(l)) {
      let c = i[l];
      for (let d = 0; d < c.length; d += 2)
        if (c[d] === t) {
          ((s ??= []), s.push(c[d + 1], r[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function Py(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = Qn(o.type, !0)),
    s = new cr(i, Ut(o), I, null);
  ((e.blueprint[r] = s), (n[r] = s), Oy(e, t, r, V1(e, n, o.hostVars, cn), o));
}
function Oy(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    (Ny(s) != a && s.push(a), s.push(n, r, i));
  }
}
function Ny(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == 'number' && n < 0) return n;
  }
  return 0;
}
function jy(e, t, n) {
  if (n) {
    if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Ut(t) && (n[''] = e);
  }
}
function By(e, t, n) {
  ((e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t));
}
function nu(e, t, n, r, o, i, s, a) {
  let l = t[B],
    c = l.consts,
    d = ai(c, s),
    h = tu(l, e, n, r, d);
  return (
    i && lg(l, t, h, ai(c, a), o),
    (h.mergedAttrs = wi(h.mergedAttrs, h.attrs)),
    h.attrs !== null && F2(h, h.attrs, !1),
    h.mergedAttrs !== null && F2(h, h.mergedAttrs, !0),
    l.queries !== null && l.queries.elementStart(l, h),
    h
  );
}
function ru(e, t) {
  (h1(e, t), Sd(t) && e.queries.elementEnd(t));
}
function ou(e) {
  return hg(e) ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e) : !1;
}
function dg(e, t) {
  if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
  else {
    let n = e[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) t(r.value);
  }
}
function hg(e) {
  return e !== null && (typeof e == 'function' || typeof e == 'object');
}
function ug(e, t, n) {
  return (e[t] = n);
}
function In(e, t, n) {
  if (n === cn) return !1;
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function pg(e, t, n, r) {
  let o = In(e, t, n);
  return In(e, t + 1, r) || o;
}
function Ly(e, t, n, r, o) {
  let i = pg(e, t, n, r);
  return In(e, t + 2, o) || i;
}
function Xd(e, t, n) {
  return function r(o) {
    let i = Cn(e) ? dt(e.index, t) : t;
    Jh(i, 5);
    let s = t[Oe],
      a = z2(t, s, n, o),
      l = r.__ngNextListenerFn__;
    for (; l; ) ((a = z2(t, s, l, o) && a), (l = l.__ngNextListenerFn__));
    return a;
  };
}
function z2(e, t, n, r) {
  let o = V(null);
  try {
    return (re(6, t, n), n(r) !== !1);
  } catch (i) {
    return (ry(e, i), !1);
  } finally {
    (re(7, t, n), V(o));
  }
}
function Fy(e, t, n, r, o, i, s, a) {
  let l = eo(e),
    c = !1,
    d = null;
  if ((!r && l && (d = Vy(t, n, i, e.index)), d !== null)) {
    let h = d.__ngLastListenerFn__ || d;
    ((h.__ngNextListenerFn__ = s), (d.__ngLastListenerFn__ = s), (c = !0));
  } else {
    let h = Xe(e, n),
      g = r ? r(h) : h;
    ik(n, g, i, a);
    let p = o.listen(g, i, a),
      x = r ? (R) => r(ct(R[e.index])) : e.index;
    gg(x, t, n, i, a, p, !1);
  }
  return c;
}
function Vy(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[Xr],
          l = o[i + 2];
        return a && a.length > l ? a[l] : null;
      }
      typeof s == 'string' && (i += 2);
    }
  return null;
}
function gg(e, t, n, r, o, i, s) {
  let a = t.firstCreatePass ? Od(t) : null,
    l = Pd(n),
    c = l.length;
  (l.push(o, i), a && a.push(r, e, c, (c + 1) * (s ? -1 : 1)));
}
function $2(e, t, n, r, o, i) {
  let s = t[n],
    a = t[B],
    c = a.data[n].outputs[r],
    h = s[c].subscribe(i);
  gg(e.index, a, t, o, i, h, !0);
}
var mh = Symbol('BINDING');
var Va = class extends Mi {
  ngModule;
  constructor(t) {
    (super(), (this.ngModule = t));
  }
  resolveComponentFactory(t) {
    let n = tn(t);
    return new dr(n, this.ngModule);
  }
};
function Hy(e) {
  return Object.keys(e).map((t) => {
    let [n, r, o] = e[t],
      i = { propName: n, templateName: t, isSignal: (r & Xa.SignalBased) !== 0 };
    return (o && (i.transform = o), i);
  });
}
function Uy(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function zy(e, t, n) {
  let r = t instanceof ke ? t : t?.injector;
  return (
    r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r),
    r ? new wh(n, r) : n
  );
}
function $y(e) {
  let t = e.get(Je, null);
  if (t === null) throw new b(407, !1);
  let n = e.get(ag, null),
    r = e.get(xt, null);
  return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r, ngReflect: !1 };
}
function Gy(e, t) {
  let n = fg(e);
  return j1(t, n, n === 'svg' ? X0 : n === 'math' ? J0 : null);
}
function fg(e) {
  return (e.selectors[0][0] || 'div').toLowerCase();
}
var dr = class extends tl {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return ((this.cachedInputs ??= Hy(this.componentDef.inputs)), this.cachedInputs);
  }
  get outputs() {
    return ((this.cachedOutputs ??= Uy(this.componentDef.outputs)), this.cachedOutputs);
  }
  constructor(t, n) {
    (super(),
      (this.componentDef = t),
      (this.ngModule = n),
      (this.componentType = t.type),
      (this.selector = yk(t.selectors)),
      (this.ngContentSelectors = t.ngContentSelectors ?? []),
      (this.isBoundToModule = !!n));
  }
  create(t, n, r, o, i, s) {
    re(22);
    let a = V(null);
    try {
      let l = this.componentDef,
        c = qy(r, l, s, i),
        d = zy(l, o || this.ngModule, t),
        h = $y(d),
        g = h.rendererFactory.createRenderer(null, l),
        p = r ? Gk(g, r, l.encapsulation, d) : Gy(l, g),
        x = s?.some(G2) || i?.some((Z) => typeof Z != 'function' && Z.bindings.some(G2)),
        R = Uh(null, c, null, 512 | F1(l), null, null, h, g, d, null, A1(p, d, !0));
      ((R[Ge] = p), Ma(R));
      let L = null;
      try {
        let Z = nu(Ge, R, 2, '#host', () => c.directiveRegistry, !0, 0);
        (p && (L1(g, p, Z), co(p, R)),
          el(c, R, Z),
          Bh(c, Z, R),
          ru(c, Z),
          n !== void 0 && Zy(Z, this.ngContentSelectors, n),
          (L = dt(Z.index, R)),
          (R[Oe] = L[Oe]),
          Qh(c, R, null));
      } catch (Z) {
        throw (L !== null && lh(L), lh(R), Z);
      } finally {
        (re(23), Ca());
      }
      return new Ha(this.componentType, R, !!x);
    } finally {
      V(a);
    }
  }
};
function qy(e, t, n, r) {
  let o = e ? ['ng-version', '20.2.1'] : _k(t.selectors[0]),
    i = null,
    s = null,
    a = 0;
  if (n)
    for (let d of n)
      ((a += d[mh].requiredVars),
        d.create && ((d.targetIdx = 0), (i ??= []).push(d)),
        d.update && ((d.targetIdx = 0), (s ??= []).push(d)));
  if (r)
    for (let d = 0; d < r.length; d++) {
      let h = r[d];
      if (typeof h != 'function')
        for (let g of h.bindings) {
          a += g[mh].requiredVars;
          let p = d + 1;
          (g.create && ((g.targetIdx = p), (i ??= []).push(g)),
            g.update && ((g.targetIdx = p), (s ??= []).push(g)));
        }
    }
  let l = [t];
  if (r)
    for (let d of r) {
      let h = typeof d == 'function' ? d : d.type,
        g = xd(h);
      l.push(g);
    }
  return Hh(0, null, Wy(i, s), 1, a, l, null, null, null, [o], null);
}
function Wy(e, t) {
  return !e && !t
    ? null
    : (n) => {
        if (n & 1 && e) for (let r of e) r.create();
        if (n & 2 && t) for (let r of t) r.update();
      };
}
function G2(e) {
  let t = e[mh].kind;
  return t === 'input' || t === 'twoWay';
}
var Ha = class extends sg {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(t, n, r) {
    (super(),
      (this._rootLView = n),
      (this._hasInputBindings = r),
      (this._tNode = wa(n[B], Ge)),
      (this.location = go(this._tNode, n)),
      (this.instance = dt(this._tNode.index, n)[Oe]),
      (this.hostView = this.changeDetectorRef = new Sn(n, void 0)),
      (this.componentType = t));
  }
  setInput(t, n) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
    )
      return;
    let o = this._rootLView,
      i = Kh(r, o[B], o, t, n);
    this.previousInputValues.set(t, n);
    let s = dt(r.index, o);
    Jh(s, 1);
  }
  get injector() {
    return new lr(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(t) {
    this.hostView.onDestroy(t);
  }
};
function Zy(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var gt = (() => {
  class e {
    static __NG_ELEMENT_ID__ = Yy;
  }
  return e;
})();
function Yy() {
  let e = ye();
  return wg(e, K());
}
var Ky = gt,
  vg = class extends Ky {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, r) {
      (super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r));
    }
    get element() {
      return go(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new lr(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Rh(this._hostTNode, this._hostLView);
      if (g1(t)) {
        let n = ja(t, this._hostLView),
          r = Na(t),
          o = n[B].data[r + 8];
        return new lr(o, n);
      } else return new lr(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = q2(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - Le;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == 'number' ? (o = r) : r != null && ((o = r.index), (i = r.injector));
      let s = L2(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return (this.insertImpl(a, o, j2(this._hostTNode, s)), a);
    }
    createComponent(t, n, r, o, i, s, a) {
      let l = t && !T4(t),
        c;
      if (l) c = n;
      else {
        let L = n || {};
        ((c = L.index),
          (r = L.injector),
          (o = L.projectableNodes),
          (i = L.environmentInjector || L.ngModuleRef),
          (s = L.directives),
          (a = L.bindings));
      }
      let d = l ? t : new dr(tn(t)),
        h = r || this.parentInjector;
      if (!i && d.ngModule == null) {
        let Z = (l ? h : this.parentInjector).get(ke, null);
        Z && (i = Z);
      }
      let g = tn(d.componentType ?? {}),
        p = L2(this._lContainer, g?.id ?? null),
        x = p?.firstChild ?? null,
        R = d.create(h, o, x, i, s, a);
      return (this.insertImpl(R.hostView, c, j2(this._hostTNode, p)), R);
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (t2(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let l = o[Me],
            c = new vg(l, l[at], l[Me]);
          c.detach(c.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return (_y(s, o, i, r), t.attachToViewContainerRef(), md(Jd(s), i, t), t);
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = q2(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = fh(this._lContainer, n);
      r && (ti(Jd(this._lContainer), n), z1(r[B], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = fh(this._lContainer, n);
      return r && ti(Jd(this._lContainer), n) != null ? new Sn(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function q2(e) {
  return e[si];
}
function Jd(e) {
  return e[si] || (e[si] = []);
}
function wg(e, t) {
  let n,
    r = t[e.index];
  return (
    Dt(r) ? (n = r) : ((n = og(r, t, null, e)), (t[e.index] = n), zh(t, n)),
    Xy(n, t, e, r),
    new vg(n, e, t)
  );
}
function Qy(e, t) {
  let n = e[ae],
    r = n.createComment(''),
    o = Xe(t, e),
    i = n.parentNode(o);
  return (Fa(n, i, r, n.nextSibling(o), !1), r);
}
var Xy = t_,
  Jy = () => !1;
function e_(e, t, n) {
  return Jy(e, t, n);
}
function t_(e, t, n, r) {
  if (e[Mn]) return;
  let o;
  (n.type & 8 ? (o = ct(r)) : (o = Qy(t, n)), (e[Mn] = o));
}
var kh = class e {
    queryList;
    matches = null;
    constructor(t) {
      this.queryList = t;
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  yh = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let n = t.queries;
      if (n !== null) {
        let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
          o = [];
        for (let i = 0; i < r; i++) {
          let s = n.getByIndex(i),
            a = this.queries[s.indexInDeclarationView];
          o.push(a.clone());
        }
        return new e(o);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let n = 0; n < this.queries.length; n++)
        iu(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  _h = class {
    flags;
    read;
    predicate;
    constructor(t, n, r = null) {
      ((this.flags = n),
        (this.read = r),
        typeof t == 'string' ? (this.predicate = c_(t)) : (this.predicate = t));
    }
  },
  xh = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, n) {
      for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(t, n);
    }
    elementEnd(t) {
      for (let n = 0; n < this.queries.length; n++) this.queries[n].elementEnd(t);
    }
    embeddedTView(t) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let o = n !== null ? n.length : 0,
          i = this.getByIndex(r).embeddedTView(t, o);
        i && ((i.indexInDeclarationView = r), n !== null ? n.push(i) : (n = [i]));
      }
      return n !== null ? new e(n) : null;
    }
    template(t, n) {
      for (let r = 0; r < this.queries.length; r++) this.queries[r].template(t, n);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  Mh = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) {
      ((this.metadata = t), (this._declarationNodeIndex = n));
    }
    elementStart(t, n) {
      this.isApplyingToNode(n) && this.matchTNode(t, n);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
    }
    template(t, n) {
      this.elementStart(t, n);
    }
    embeddedTView(t, n) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = !0), this.addMatch(-t.index, n), new e(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = t.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let o = 0; o < r.length; o++) {
          let i = r[o];
          (this.matchTNodeWithReadOption(t, n, n_(n, i)),
            this.matchTNodeWithReadOption(t, n, Ra(n, t, i, !1, !1)));
        }
      else
        r === Gt
          ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
          : this.matchTNodeWithReadOption(t, n, Ra(n, t, r, !1, !1));
    }
    matchTNodeWithReadOption(t, n, r) {
      if (r !== null) {
        let o = this.metadata.read;
        if (o !== null)
          if (o === ge || o === gt || (o === Gt && n.type & 4)) this.addMatch(n.index, -2);
          else {
            let i = Ra(n, t, o, !1, !1);
            i !== null && this.addMatch(n.index, i);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(t, n) {
      this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
    }
  };
function n_(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function r_(e, t) {
  return e.type & 11 ? go(e, t) : e.type & 4 ? eu(e, t) : null;
}
function o_(e, t, n, r) {
  return n === -1 ? r_(t, e) : n === -2 ? i_(e, t, r) : mi(e, e[B], n, t);
}
function i_(e, t, n) {
  if (n === ge) return go(t, e);
  if (n === Gt) return eu(t, e);
  if (n === gt) return wg(t, e);
}
function mg(e, t, n, r) {
  let o = t[Vt].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let l = 0; s !== null && l < s.length; l += 2) {
      let c = s[l];
      if (c < 0) a.push(null);
      else {
        let d = i[c];
        a.push(o_(t, d, s[l + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function Ch(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = mg(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let l = i[a];
      if (l > 0) r.push(s[a / 2]);
      else {
        let c = i[a + 1],
          d = t[-l];
        for (let h = Le; h < d.length; h++) {
          let g = d[h];
          g[xn] === g[Me] && Ch(g[B], g, c, r);
        }
        if (d[or] !== null) {
          let h = d[or];
          for (let g = 0; g < h.length; g++) {
            let p = h[g];
            Ch(p[B], p, c, r);
          }
        }
      }
    }
  }
  return r;
}
function s_(e, t) {
  return e[Vt].queries[t].queryList;
}
function a_(e, t, n) {
  let r = new La((n & 4) === 4);
  return (Nd(e, t, r, r.destroy), (t[Vt] ??= new yh()).queries.push(new kh(r)) - 1);
}
function l_(e, t, n) {
  let r = Ie();
  return (
    r.firstCreatePass && (d_(r, new _h(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    a_(r, K(), t)
  );
}
function c_(e) {
  return e.split(',').map((t) => t.trim());
}
function d_(e, t, n) {
  (e.queries === null && (e.queries = new xh()), e.queries.track(new Mh(t, n)));
}
function iu(e, t) {
  return e.queries.getByIndex(t);
}
function h_(e, t) {
  let n = e[B],
    r = iu(n, t);
  return r.crossesNgTemplate ? Ch(n, e, t, []) : mg(n, e, r, t);
}
var W2 = new Set();
function gr(e) {
  W2.has(e) || (W2.add(e), performance?.mark?.('mark_feature_usage', { detail: { feature: e } }));
}
var hr = class {},
  nl = class {};
var Ua = class extends hr {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Va(this);
    constructor(t, n, r, o = !0) {
      (super(), (this.ngModuleType = t), (this._parent = n));
      let i = _d(t);
      ((this._bootstrapComponents = O1(i.bootstrap)),
        (this._r3Injector = $d(
          t,
          n,
          [
            { provide: hr, useValue: this },
            { provide: Mi, useValue: this.componentFactoryResolver },
            ...r,
          ],
          en(t),
          new Set(['environment']),
        )),
        o && this.resolveInjectorInitializers());
    }
    resolveInjectorInitializers() {
      (this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType)));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      (!t.destroyed && t.destroy(), this.destroyCbs.forEach((n) => n()), (this.destroyCbs = null));
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  za = class extends nl {
    moduleType;
    constructor(t) {
      (super(), (this.moduleType = t));
    }
    create(t) {
      return new Ua(this.moduleType, t, []);
    }
  };
var yi = class extends hr {
  injector;
  componentFactoryResolver = new Va(this);
  instance = null;
  constructor(t) {
    super();
    let n = new Jn(
      [
        ...t.providers,
        { provide: hr, useValue: this },
        { provide: Mi, useValue: this.componentFactoryResolver },
      ],
      t.parent || Qr(),
      t.debugName,
      new Set(['environment']),
    );
    ((this.injector = n), t.runEnvironmentInitializers && n.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function Ci(e, t, n = null) {
  return new yi({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector;
}
var u_ = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Md(!1, n.type),
          o = r.length > 0 ? Ci([r], this._injector, `Standalone[${n.type.name}]`) : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = y({ token: e, providedIn: 'environment', factory: () => new e(O(ke)) });
  }
  return e;
})();
function se(e) {
  return po(() => {
    let t = kg(e),
      n = F(w({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Oh.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(u_).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || ln.Emulated,
        styles: e.styles || Ke,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      });
    (t.standalone && gr('NgStandalone'), yg(n));
    let r = e.dependencies;
    return ((n.directiveDefs = Z2(r, p_)), (n.pipeDefs = Z2(r, G0)), (n.id = v_(n)), n);
  });
}
function p_(e) {
  return tn(e) || xd(e);
}
function Fe(e) {
  return po(() => ({
    type: e.type,
    bootstrap: e.bootstrap || Ke,
    declarations: e.declarations || Ke,
    imports: e.imports || Ke,
    exports: e.exports || Ke,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function g_(e, t) {
  if (e == null) return yn;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        l;
      (Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (l = o[3] || null))
        : ((i = o), (s = o), (a = Xa.None), (l = null)),
        (n[i] = [r, a, l]),
        (t[i] = s));
    }
  return n;
}
function f_(e) {
  if (e == null) return yn;
  let t = {};
  for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
  return t;
}
function oe(e) {
  return po(() => {
    let t = kg(e);
    return (yg(t), t);
  });
}
function kg(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputConfig: e.inputs || yn,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || Ke,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: g_(e.inputs, t),
    outputs: f_(e.outputs),
    debugInfo: null,
  };
}
function yg(e) {
  e.features?.forEach((t) => t(e));
}
function Z2(e, t) {
  return e
    ? () => {
        let n = typeof e == 'function' ? e() : e,
          r = [];
        for (let o of n) {
          let i = t(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function v_(e) {
  let t = 0,
    n = typeof e.consts == 'function' ? '' : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join('|')) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return ((t += 2147483648), 'c' + t);
}
function w_(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function ft(e) {
  let t = w_(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (Ut(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new b(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        ((s.inputs = eh(e.inputs)),
          (s.declaredInputs = eh(e.declaredInputs)),
          (s.outputs = eh(e.outputs)));
        let a = o.hostBindings;
        a && x_(e, a);
        let l = o.viewQuery,
          c = o.contentQueries;
        if (
          (l && y_(e, l),
          c && __(e, c),
          m_(e, o),
          j0(e.outputs, o.outputs),
          Ut(o) && o.data.animation)
        ) {
          let d = e.data;
          d.animation = (d.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          (a && a.ngInherit && a(e), a === ft && (n = !1));
        }
    }
    t = Object.getPrototypeOf(t);
  }
  k_(r);
}
function m_(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    r !== void 0 && ((e.inputs[n] = r), (e.declaredInputs[n] = t.declaredInputs[n]));
  }
}
function k_(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    ((o.hostVars = t += o.hostVars), (o.hostAttrs = wi(o.hostAttrs, (n = wi(n, o.hostAttrs)))));
  }
}
function eh(e) {
  return e === yn ? {} : e === Ke ? [] : e;
}
function y_(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        (t(r, o), n(r, o));
      })
    : (e.viewQuery = t);
}
function __(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        (t(r, o, i), n(r, o, i));
      })
    : (e.contentQueries = t);
}
function x_(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        (t(r, o), n(r, o));
      })
    : (e.hostBindings = t);
}
function M_(e, t, n, r, o, i, s, a) {
  if (n.firstCreatePass) {
    e.mergedAttrs = wi(e.mergedAttrs, e.attrs);
    let d = (e.tView = Hh(
      2,
      e,
      o,
      i,
      s,
      n.directiveRegistry,
      n.pipeRegistry,
      null,
      n.schemas,
      n.consts,
      null,
    ));
    n.queries !== null && (n.queries.template(n, e), (d.queries = n.queries.embeddedTView(e)));
  }
  (a && (e.flags |= a), no(e, !1));
  let l = D_(n, t, e, r);
  (ba() && qh(n, t, l, e), co(l, t));
  let c = og(l, t, l, e);
  ((t[r + Ge] = c), zh(t, c), e_(c, e, t));
}
function C_(e, t, n, r, o, i, s, a, l, c, d) {
  let h = n + Ge,
    g;
  return (
    t.firstCreatePass
      ? ((g = tu(t, h, 4, s || null, a || null)),
        ya() && lg(t, e, g, ai(t.consts, c), Yh),
        h1(t, g))
      : (g = t.data[h]),
    M_(g, e, t, n, r, o, i, l),
    eo(g) && el(t, e, g),
    c != null && Zh(e, g, d),
    g
  );
}
function Q(e, t, n, r, o, i, s, a) {
  let l = K(),
    c = Ie(),
    d = ai(c.consts, i);
  return (C_(l, c, e, t, n, r, o, d, void 0, s, a), Q);
}
var D_ = b_;
function b_(e, t, n, r) {
  return (hi(!0), t[ae].createComment(''));
}
var rl = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = 'CHANGE_DETECTION'),
      (e[(e.AFTER_NEXT_RENDER = 1)] = 'AFTER_NEXT_RENDER'),
      e
    );
  })(rl || {}),
  fr = new _(''),
  _g = !1,
  Dh = class extends P {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      (super(),
        (this.__isAsync = t),
        K0() &&
          ((this.destroyRef = u(ht, { optional: !0 }) ?? void 0),
          (this.pendingTasks = u(on, { optional: !0 }) ?? void 0)));
    }
    emit(t) {
      let n = V(null);
      try {
        super.next(t);
      } finally {
        V(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == 'object') {
        let l = t;
        ((o = l.next?.bind(l)), (i = l.error?.bind(l)), (s = l.complete?.bind(l)));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return (t instanceof J && t.add(a), a);
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            t(n);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  T = Dh;
function xg(e) {
  let t, n;
  function r() {
    e = ar;
    try {
      (n !== void 0 && typeof cancelAnimationFrame == 'function' && cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t));
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      (e(), r());
    })),
    typeof requestAnimationFrame == 'function' &&
      (n = requestAnimationFrame(() => {
        (e(), r());
      })),
    () => r()
  );
}
function Y2(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = ar;
    }
  );
}
var su = 'isAngularZone',
  $a = su + '_ID',
  E_ = 0,
  X = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new T(!1);
    onMicrotaskEmpty = new T(!1);
    onStable = new T(!1);
    onError = new T(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = _g,
      } = t;
      if (typeof Zone > 'u') throw new b(908, !1);
      Zone.assertZonePatched();
      let s = this;
      ((s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        T_(s));
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(su) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new b(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new b(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask('NgZoneEvent: ' + o, t, S_, ar, ar);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  S_ = {};
function au(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      (e._nesting++, e.onMicrotaskEmpty.emit(null));
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function I_(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    xg(() => {
      ((e.callbackScheduled = !1),
        bh(e),
        (e.isCheckStableRunning = !0),
        au(e),
        (e.isCheckStableRunning = !1));
    });
  }
  (e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    bh(e));
}
function T_(e) {
  let t = () => {
      I_(e);
    },
    n = E_++;
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { [su]: !0, [$a]: n, [$a + n]: !0 },
    onInvokeTask: (r, o, i, s, a, l) => {
      if (A_(l)) return r.invokeTask(i, s, a, l);
      try {
        return (K2(e), r.invokeTask(i, s, a, l));
      } finally {
        (((e.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Q2(e));
      }
    },
    onInvoke: (r, o, i, s, a, l, c) => {
      try {
        return (K2(e), r.invoke(i, s, a, l, c));
      } finally {
        (e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !R_(l) && t(), Q2(e));
      }
    },
    onHasTask: (r, o, i, s) => {
      (r.hasTask(i, s),
        o === i &&
          (s.change == 'microTask'
            ? ((e._hasPendingMicrotasks = s.microTask), bh(e), au(e))
            : s.change == 'macroTask' && (e.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s),
      e.runOutsideAngular(() => e.onError.emit(s)),
      !1
    ),
  });
}
function bh(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function K2(e) {
  (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function Q2(e) {
  (e._nesting--, au(e));
}
var _i = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new T();
  onMicrotaskEmpty = new T();
  onStable = new T();
  onError = new T();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function A_(e) {
  return Mg(e, '__ignore_ng_zone__');
}
function R_(e) {
  return Mg(e, '__scheduler_tick__');
}
function Mg(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var lu = (() => {
    class e {
      impl = null;
      execute() {
        this.impl?.execute();
      }
      static ɵprov = y({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  Cg = [0, 1, 2, 3],
  Dg = (() => {
    class e {
      ngZone = u(X);
      scheduler = u(xt);
      errorHandler = u(it, { optional: !0 });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = !1;
      constructor() {
        u(fr, { optional: !0 });
      }
      execute() {
        let n = this.sequences.size > 0;
        (n && re(16), (this.executing = !0));
        for (let r of Cg)
          for (let o of this.sequences)
            if (!(o.erroredOrDestroyed || !o.hooks[r]))
              try {
                o.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                  this.maybeTrace(() => {
                    let i = o.hooks[r];
                    return i(o.pipelinedValue);
                  }, o.snapshot),
                );
              } catch (i) {
                ((o.erroredOrDestroyed = !0), this.errorHandler?.handleError(i));
              }
        this.executing = !1;
        for (let r of this.sequences)
          (r.afterRun(), r.once && (this.sequences.delete(r), r.destroy()));
        for (let r of this.deferredRegistrations) this.sequences.add(r);
        (this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
          this.deferredRegistrations.clear(),
          n && re(17));
      }
      register(n) {
        let { view: r } = n;
        r !== void 0
          ? ((r[rr] ??= []).push(n), Dn(r), (r[N] |= 8192))
          : this.executing
            ? this.deferredRegistrations.add(n)
            : this.addSequence(n);
      }
      addSequence(n) {
        (this.sequences.add(n), this.scheduler.notify(7));
      }
      unregister(n) {
        this.executing && this.sequences.has(n)
          ? ((n.erroredOrDestroyed = !0), (n.pipelinedValue = void 0), (n.once = !0))
          : (this.sequences.delete(n), this.deferredRegistrations.delete(n));
      }
      maybeTrace(n, r) {
        return r ? r.run(rl.AFTER_NEXT_RENDER, n) : n();
      }
      static ɵprov = y({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  Ga = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, r, o, i, s = null) {
      ((this.impl = t),
        (this.hooks = n),
        (this.view = r),
        (this.once = o),
        (this.snapshot = s),
        (this.unregisterOnDestroy = i?.onDestroy(() => this.destroy())));
    }
    afterRun() {
      ((this.erroredOrDestroyed = !1),
        (this.pipelinedValue = void 0),
        this.snapshot?.dispose(),
        (this.snapshot = null));
    }
    destroy() {
      (this.impl.unregister(this), this.unregisterOnDestroy?.());
      let t = this.view?.[rr];
      t && (this.view[rr] = t.filter((n) => n !== this));
    }
  };
function vr(e, t) {
  let n = t?.injector ?? u(pe);
  return (gr('NgAfterNextRender'), O_(e, n, t, !0));
}
function P_(e) {
  return e instanceof Function
    ? [void 0, void 0, e, void 0]
    : [e.earlyRead, e.write, e.mixedReadWrite, e.read];
}
function O_(e, t, n, r) {
  let o = t.get(lu);
  o.impl ??= t.get(Dg);
  let i = t.get(fr, null, { optional: !0 }),
    s = n?.manualCleanup !== !0 ? t.get(ht) : null,
    a = t.get(oo, null, { optional: !0 }),
    l = new Ga(o.impl, P_(e), a?.view, r, s, i?.snapshot(null));
  return (o.impl.register(l), l);
}
var cu = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'platform' });
  }
  return e;
})();
var du = new _('');
function An(e) {
  return !!e && typeof e.then == 'function';
}
function hu(e) {
  return !!e && typeof e.subscribe == 'function';
}
var bg = new _('');
var uu = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        ((this.resolve = n), (this.reject = r));
      });
      appInits = u(bg, { optional: !0 }) ?? [];
      injector = u(pe);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = Se(this.injector, o);
          if (An(i)) n.push(i);
          else if (hu(i)) {
            let s = new Promise((a, l) => {
              i.subscribe({ complete: a, error: l });
            });
            n.push(s);
          }
        }
        let r = () => {
          ((this.done = !0), this.resolve());
        };
        (Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  ol = new _('');
function Eg() {
  Sc(() => {
    let e = '';
    throw new b(600, e);
  });
}
function Sg(e) {
  return e.isBoundToModule;
}
var N_ = 10;
var vt = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = u(ut);
    afterRenderManager = u(lu);
    zonelessEnabled = u(pi);
    rootEffectScheduler = u(gi);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new P();
    get allViews() {
      return [
        ...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = u(on);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(G((n) => !n));
    }
    constructor() {
      u(fr, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = u(ke);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, o = pe.NULL) {
      return this._injector.get(X).run(() => {
        re(10);
        let s = n instanceof tl;
        if (!this._injector.get(uu).done) {
          let x = '';
          throw new b(405, x);
        }
        let l;
        (s ? (l = n) : (l = this._injector.get(Mi).resolveComponentFactory(n)),
          this.componentTypes.push(l.componentType));
        let c = Sg(l) ? void 0 : this._injector.get(hr),
          d = r || l.selector,
          h = l.create(o, [], d, c),
          g = h.location.nativeElement,
          p = h.injector.get(du, null);
        return (
          p?.registerApplication(g),
          h.onDestroy(() => {
            (this.detachView(h.hostView), vi(this.components, h), p?.unregisterApplication(g));
          }),
          this._loadComponent(h),
          re(11, h),
          h
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (re(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(rl.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw new b(101, !1);
      let n = V(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          V(n),
          this.afterTick.next(),
          re(13));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Je, null, { optional: !0 }));
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < N_; ) (re(14), this.synchronizeOnce(), re(15));
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 && ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let n = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: o } of this.allViews) {
          if (!r && !li(o)) continue;
          let i = r && !this.zonelessEnabled ? 0 : 1;
          (Xh(o, i), (n = !0));
        }
        if (((this.dirtyFlags &= -5), this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)) return;
      }
      (n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 && ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => li(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      (this._views.push(r), r.attachToAppRef(this));
    }
    detachView(n) {
      let r = n;
      (vi(this._views, r), r.detachFromAppRef());
    }
    _loadComponent(n) {
      this.attachView(n.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      (this.components.push(n), this._injector.get(ol, []).forEach((o) => o(n)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy()));
        } finally {
          ((this._destroyed = !0), (this._views = []), (this._destroyListeners = []));
        }
    }
    onDestroy(n) {
      return (this._destroyListeners.push(n), () => vi(this._destroyListeners, n));
    }
    destroy() {
      if (this._destroyed) throw new b(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function vi(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Ne(e, t, n, r) {
  let o = K(),
    i = di();
  if (In(o, i, t)) {
    let s = Ie(),
      a = Da();
    ey(a, o, e, t, n, r);
  }
  return Ne;
}
var il = new _('', { providedIn: 'root', factory: () => !1 }),
  pu = new _('', { providedIn: 'root', factory: () => j_ }),
  j_ = 4e3,
  qa = class {
    outElements = new WeakMap();
    remove(t) {
      this.outElements.delete(t);
    }
    trackClasses(t, n) {
      let r = Ig(n);
      if (r) for (let o of r) t.classes?.add(o);
    }
    trackResolver(t, n) {
      t.classFns ? t.classFns.push(n) : (t.classFns = [n]);
    }
    addCallback(t, n, r) {
      let o = this.outElements.get(t) ?? { classes: null, animateFn: () => {} };
      ((o.animateFn = r(t, n)), this.outElements.set(t, o));
    }
    add(t, n, r) {
      let o = this.outElements.get(t) ?? { classes: new Set(), animateFn: () => {} };
      (typeof n == 'function' ? this.trackResolver(o, n) : this.trackClasses(o, n),
        (o.animateFn = r(t, o.classes, o.classFns)),
        this.outElements.set(t, o));
    }
    has(t) {
      return this.outElements.has(t);
    }
    animate(t, n, r) {
      if (!this.outElements.has(t)) return n();
      let o = this.outElements.get(t),
        i,
        s = !1,
        a = () => {
          s || ((s = !0), clearTimeout(i), this.remove(t), n());
        };
      ((i = setTimeout(a, r)), o.animateFn(a));
    }
  };
function Ig(e) {
  let t = typeof e == 'function' ? e() : e,
    n = Array.isArray(t) ? t : null;
  return (
    typeof t == 'string' &&
      (n = t
        .trim()
        .split(/\s+/)
        .filter((r) => r)),
    n
  );
}
function Wa(e) {
  let t = e.toLowerCase().indexOf('ms') > -1 ? 1 : 1e3;
  return parseFloat(e) * t;
}
function ao(e, t) {
  return e
    .getPropertyValue(t)
    .split(',')
    .map((r) => r.trim());
}
function B_(e) {
  let t = ao(e, 'transition-property'),
    n = ao(e, 'transition-duration'),
    r = ao(e, 'transition-delay'),
    o = { propertyName: '', duration: 0, animationName: void 0 };
  for (let i = 0; i < t.length; i++) {
    let s = Wa(r[i]) + Wa(n[i]);
    s > o.duration && ((o.propertyName = t[i]), (o.duration = s));
  }
  return o;
}
function L_(e) {
  let t = ao(e, 'animation-name'),
    n = ao(e, 'animation-delay'),
    r = ao(e, 'animation-duration'),
    o = { animationName: '', propertyName: void 0, duration: 0 };
  for (let i = 0; i < t.length; i++) {
    let s = Wa(n[i]) + Wa(r[i]);
    s > o.duration && ((o.animationName = t[i]), (o.duration = s));
  }
  return o;
}
function Tg(e, t) {
  return e !== void 0 && e.duration > t.duration;
}
function Ag(e) {
  return (e.animationName != null || e.propertyName != null) && e.duration > 0;
}
function F_(e, t) {
  let n = getComputedStyle(e),
    r = L_(n),
    o = B_(n),
    i = r.duration > o.duration ? r : o;
  Tg(t.get(e), i) || (Ag(i) && t.set(e, i));
}
function Rg(e, t, n) {
  if (!n) return;
  let r = e.getAnimations();
  return r.length === 0 ? F_(e, t) : V_(e, t, r);
}
function V_(e, t, n) {
  let r = { animationName: void 0, propertyName: void 0, duration: 0 };
  for (let o of n) {
    let i = o.effect?.getTiming(),
      s = typeof i?.duration == 'number' ? i.duration : 0,
      a = (i?.delay ?? 0) + s,
      l,
      c;
    (o.animationName ? (c = o.animationName) : (l = o.transitionProperty),
      a >= r.duration && (r = { animationName: c, propertyName: l, duration: a }));
  }
  Tg(t.get(e), r) || (Ag(r) && t.set(e, r));
}
var H_ = !1,
  ho = typeof document < 'u' && typeof document?.documentElement?.getAnimations == 'function';
function Pg(e) {
  return e[Ft].get(il, H_);
}
function U_(e, t, n, r) {
  t[N] & 8 &&
    Nd(n, t, r, (o) => {
      e.elements.remove(o);
    });
}
function gu(e) {
  let t = ur.get(e);
  if (t) {
    for (let n of t.cleanupFns) n();
    ur.delete(e);
  }
  En.delete(e);
}
var ur = new WeakMap(),
  En = new WeakMap(),
  lo = new WeakMap();
function X2(e) {
  lo.get(e)?.length === 0 && lo.delete(e);
}
function z_(e, t) {
  lo.has(e) ? lo.get(e)?.push(t) : lo.set(e, [t]);
}
function sn(e) {
  if ((gr('NgAnimateEnter'), !ho)) return sn;
  let t = K();
  if (Pg(t)) return sn;
  let n = ye(),
    r = Xe(n, t),
    o = t[ae],
    i = t[Ft].get(X),
    s = Ig(e),
    a = [],
    l = (d) => {
      W_(d, o);
      let h = d instanceof AnimationEvent ? 'animationend' : 'transitionend';
      i.runOutsideAngular(() => {
        a.push(o.listen(r, h, c));
      });
    },
    c = (d) => {
      Z_(d, r, o);
    };
  if (s && s.length > 0) {
    (i.runOutsideAngular(() => {
      (a.push(o.listen(r, 'animationstart', l)), a.push(o.listen(r, 'transitionstart', l)));
    }),
      lo
        .get(n)
        ?.pop()
        ?.dispatchEvent(new CustomEvent('animationend', { detail: { cancel: !0 } })),
      $_(r, s, a));
    for (let d of s) o.addClass(r, d);
    i.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        if ((Rg(r, En, ho), !En.has(r))) {
          for (let d of s) o.removeClass(r, d);
          gu(r);
        }
      });
    });
  }
  return sn;
}
function $_(e, t, n) {
  let r = ur.get(e);
  if (r) {
    for (let o of t) r.classList.push(o);
    for (let o of n) r.cleanupFns.push(o);
  } else ur.set(e, { classList: t, cleanupFns: n });
}
function an(e) {
  if ((gr('NgAnimateLeave'), !ho)) return an;
  let t = K(),
    n = Pg(t);
  if (n) return an;
  let r = Ie(),
    o = ye(),
    i = Xe(o, t),
    s = t[ae],
    a = ui(),
    l = t[Ft].get(X),
    c = (d, h, g) => (p) => {
      Y_(d, o, G_(h, g), p, s, n, l);
    };
  return (U_(a, t, r, i), a.elements.add(i, e, c), an);
}
function G_(e, t) {
  let n = new Set(e);
  if (t && t.length)
    for (let r of t) {
      let o = r();
      if (o instanceof Array) for (let i of o) n.add(i);
      else n.add(o);
    }
  return n;
}
function q_(e, t) {
  if (!ho) return;
  let n = ur.get(e);
  if (e.getAnimations().length > 0)
    for (let r of e.getAnimations()) r.playState === 'running' && r.cancel();
  else if (n) for (let r of n.classList) t.removeClass(e, r);
  gu(e);
}
function W_(e, t) {
  if (!(e.target instanceof Element)) return;
  let n = e.target;
  if (ho) {
    let r = ur.get(n),
      o = n.getAnimations();
    if (o.length === 0) return;
    for (let i of o)
      i.addEventListener('cancel', (s) => {
        if (n === s.target && r?.classList) for (let a of r.classList) t.removeClass(n, a);
      });
  }
}
function Og(e, t) {
  let n = En.get(t);
  return (
    t === e.target &&
    n !== void 0 &&
    ((n.animationName !== void 0 && e.animationName === n.animationName) ||
      (n.propertyName !== void 0 && e.propertyName === n.propertyName))
  );
}
function Z_(e, t, n) {
  let r = ur.get(t);
  if (r && Og(e, t)) {
    e.stopImmediatePropagation();
    for (let o of r.classList) n.removeClass(t, o);
    gu(t);
  }
}
function Y_(e, t, n, r, o, i, s) {
  if (i) {
    (En.delete(e), r());
    return;
  }
  q_(e, o);
  let a = (l) => {
    (l instanceof CustomEvent || Og(l, e)) &&
      (l.stopImmediatePropagation(), En.delete(e), X2(t), r());
  };
  (s.runOutsideAngular(() => {
    (o.listen(e, 'animationend', a), o.listen(e, 'transitionend', a));
  }),
    z_(t, e));
  for (let l of n) o.addClass(e, l);
  s.runOutsideAngular(() => {
    requestAnimationFrame(() => {
      (Rg(e, En, ho), En.has(e) || (X2(t), r()));
    });
  });
}
function A(e, t, n) {
  let r = K(),
    o = di();
  if (In(r, o, t)) {
    let i = Ie(),
      s = Da();
    q1(s, r, e, t, r[ae], n);
  }
  return A;
}
function J2(e, t, n, r, o) {
  Kh(t, e, n, o ? 'class' : 'style', r);
}
function f(e, t, n, r) {
  let o = K(),
    i = o[B],
    s = e + Ge,
    a = i.firstCreatePass ? nu(s, o, 2, t, Yh, ya(), n, r) : i.data[s];
  if ((W1(a, o, e, t, K_), eo(a))) {
    let l = o[B];
    (el(l, o, a), Bh(l, a, o));
  }
  return (r != null && Zh(o, a), f);
}
function v() {
  let e = Ie(),
    t = ye(),
    n = Z1(t);
  return (
    e.firstCreatePass && ru(e, n),
    l2(n) && c2(),
    s2(),
    n.classesWithoutHost != null && j4(n) && J2(e, n, K(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null && B4(n) && J2(e, n, K(), n.stylesWithoutHost, !1),
    v
  );
}
function E(e, t, n, r) {
  return (f(e, t, n, r), v(), E);
}
var K_ = (e, t, n, r, o) => (hi(!0), j1(t[ae], r, x2()));
function St(e, t, n) {
  let r = K(),
    o = r[B],
    i = e + Ge,
    s = o.firstCreatePass ? nu(i, r, 8, 'ng-container', Yh, ya(), t, n) : o.data[i];
  if ((W1(s, r, e, 'ng-container', Q_), eo(s))) {
    let a = r[B];
    (el(a, r, s), Bh(a, s, r));
  }
  return (n != null && Zh(r, s), St);
}
function It() {
  let e = Ie(),
    t = ye(),
    n = Z1(t);
  return (e.firstCreatePass && ru(e, n), It);
}
var Q_ = (e, t, n, r, o) => (hi(!0), Ck(t[ae], ''));
function _e() {
  return K();
}
var Di = 'en-US';
var X_ = Di;
function Ng(e) {
  typeof e == 'string' && (X_ = e.toLowerCase().replace(/_/g, '-'));
}
function S(e, t, n) {
  let r = K(),
    o = Ie(),
    i = ye();
  return (jg(o, r, r[ae], i, e, t, n), S);
}
function jg(e, t, n, r, o, i, s) {
  let a = !0,
    l = null;
  if (((r.type & 3 || s) && ((l ??= Xd(r, t, i)), Fy(r, e, t, s, n, o, i, l) && (a = !1)), a)) {
    let c = r.outputs?.[o],
      d = r.hostDirectiveOutputs?.[o];
    if (d && d.length)
      for (let h = 0; h < d.length; h += 2) {
        let g = d[h],
          p = d[h + 1];
        ((l ??= Xd(r, t, i)), $2(r, t, g, p, o, l));
      }
    if (c && c.length) for (let h of c) ((l ??= Xd(r, t, i)), $2(r, t, h, o, o, l));
  }
}
function k(e = 1) {
  return _2(e);
}
function wr(e, t, n) {
  l_(e, t, n);
}
function mr(e) {
  let t = K(),
    n = Ie(),
    r = Hd();
  xa(r + 1);
  let o = iu(n, r);
  if (e.dirty && e2(t) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = h_(t, r);
      (e.reset(i, K4), e.notifyOnChanges());
    }
    return !0;
  }
  return !1;
}
function kr() {
  return s_(K(), Hd());
}
function Ia(e, t) {
  return (e << 17) | (t << 2);
}
function pr(e) {
  return (e >> 17) & 32767;
}
function J_(e) {
  return (e & 2) == 2;
}
function ex(e, t) {
  return (e & 131071) | (t << 17);
}
function Eh(e) {
  return e | 2;
}
function uo(e) {
  return (e & 131068) >> 2;
}
function th(e, t) {
  return (e & -131069) | (t << 2);
}
function tx(e) {
  return (e & 1) === 1;
}
function Sh(e) {
  return e | 1;
}
function nx(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = pr(s),
    l = uo(s);
  e[r] = n;
  let c = !1,
    d;
  if (Array.isArray(n)) {
    let h = n;
    ((d = h[1]), (d === null || Kr(h, d) > 0) && (c = !0));
  } else d = n;
  if (o)
    if (l !== 0) {
      let g = pr(e[a + 1]);
      ((e[r + 1] = Ia(g, a)),
        g !== 0 && (e[g + 1] = th(e[g + 1], r)),
        (e[a + 1] = ex(e[a + 1], r)));
    } else ((e[r + 1] = Ia(a, 0)), a !== 0 && (e[a + 1] = th(e[a + 1], r)), (a = r));
  else ((e[r + 1] = Ia(l, 0)), a === 0 ? (a = r) : (e[l + 1] = th(e[l + 1], r)), (l = r));
  (c && (e[r + 1] = Eh(e[r + 1])),
    e1(e, d, r, !0),
    e1(e, d, r, !1),
    rx(t, d, e, r, i),
    (s = Ia(a, l)),
    i ? (t.classBindings = s) : (t.styleBindings = s));
}
function rx(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null && typeof t == 'string' && Kr(i, t) >= 0 && (n[r + 1] = Sh(n[r + 1]));
}
function e1(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? pr(o) : uo(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let l = e[s],
      c = e[s + 1];
    (ox(l, t) && ((a = !0), (e[s + 1] = r ? Sh(c) : Eh(c))), (s = r ? pr(c) : uo(c)));
  }
  a && (e[n + 1] = r ? Eh(o) : Sh(o));
}
function ox(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == 'string'
      ? Kr(e, t) >= 0
      : !1;
}
function Tt(e, t, n) {
  return (Bg(e, t, n, !1), Tt);
}
function ie(e, t) {
  return (Bg(e, t, null, !0), ie);
}
function Bg(e, t, n, r) {
  let o = K(),
    i = Ie(),
    s = p2(2);
  if ((i.firstUpdatePass && sx(i, e, s, r), t !== cn && In(o, s, t))) {
    let a = i.data[sr()];
    hx(i, a, o, o[ae], e, (o[s + 1] = ux(t, n)), r, s);
  }
}
function ix(e, t) {
  return t >= e.expandoStartIndex;
}
function sx(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[sr()],
      s = ix(e, n);
    (px(i, r) && t === null && !s && (t = !1), (t = ax(o, i, t, r)), nx(o, i, t, n, s, r));
  }
}
function ax(e, t, n, r) {
  let o = w2(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = nh(null, e, t, n, r)), (n = xi(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = nh(o, e, t, n, r)), i === null)) {
        let l = lx(e, t, r);
        l !== void 0 &&
          Array.isArray(l) &&
          ((l = nh(null, e, t, l[1], r)), (l = xi(l, t.attrs, r)), cx(e, t, r, l));
      } else i = dx(e, t, r);
  }
  return (i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n);
}
function lx(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (uo(r) !== 0) return e[pr(r)];
}
function cx(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[pr(o)] = r;
}
function dx(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = xi(r, s, n);
  }
  return xi(r, t.attrs, n);
}
function nh(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = xi(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return (e !== null && (n.directiveStylingLast = a), r);
}
function xi(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == 'number'
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]), $0(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function hx(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let l = e.data,
    c = l[a + 1],
    d = tx(c) ? t1(l, t, n, o, uo(c), s) : void 0;
  if (!Za(d)) {
    Za(i) || (J_(c) && (i = t1(l, null, n, o, a, s)));
    let h = Id(sr(), n);
    $k(r, s, h, o, i);
  }
}
function t1(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let l = e[o],
      c = Array.isArray(l),
      d = c ? l[1] : l,
      h = d === null,
      g = n[o + 1];
    g === cn && (g = h ? Ke : void 0);
    let p = h ? fa(g, r) : d === r ? g : void 0;
    if ((c && !Za(p) && (p = fa(l, r)), Za(p) && ((a = p), s))) return a;
    let x = e[o + 1];
    o = s ? pr(x) : uo(x);
  }
  if (t !== null) {
    let l = i ? t.residualClasses : t.residualStyles;
    l != null && (a = fa(l, r));
  }
  return a;
}
function Za(e) {
  return e !== void 0;
}
function ux(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string' ? (e = e + t) : typeof e == 'object' && (e = en(P1(e)))),
    e
  );
}
function px(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
function M(e, t = '') {
  let n = K(),
    r = Ie(),
    o = e + Ge,
    i = r.firstCreatePass ? tu(r, o, 1, t, null) : r.data[o],
    s = gx(r, n, i, t, e);
  ((n[o] = s), ba() && qh(r, n, s, i), no(i, !1));
}
var gx = (e, t, n, r, o) => (hi(!0), xk(t[ae], r));
function fx(e, t, n, r = '') {
  return In(e, di(), n) ? t + ua(n) + r : cn;
}
function he(e) {
  return (xe('', e), he);
}
function xe(e, t, n) {
  let r = K(),
    o = fx(r, e, t, n);
  return (o !== cn && vx(r, sr(), o), xe);
}
function vx(e, t, n) {
  let r = Id(t, e);
  Mk(e[ae], r, n);
}
function Rn(e, t, n) {
  Wd(t) && (t = t());
  let r = K(),
    o = di();
  if (In(r, o, t)) {
    let i = Ie(),
      s = Da();
    q1(s, r, e, t, r[ae], n);
  }
  return Rn;
}
function yr(e, t) {
  let n = Wd(e);
  return (n && e.set(t), n);
}
function Pn(e, t) {
  let n = K(),
    r = Ie(),
    o = ye();
  return (jg(r, n, n[ae], o, e, t), Pn);
}
function wx(e, t, n) {
  let r = Ie();
  if (r.firstCreatePass) {
    let o = Ut(e);
    (Ih(n, r.data, r.blueprint, o, !0), Ih(t, r.data, r.blueprint, o, !1));
  }
}
function Ih(e, t, n, r, o) {
  if (((e = Ee(e)), Array.isArray(e))) for (let i = 0; i < e.length; i++) Ih(e[i], t, n, r, o);
  else {
    let i = Ie(),
      s = K(),
      a = ye(),
      l = Xn(e) ? e : Ee(e.provide),
      c = Dd(e),
      d = a.providerIndexes & 1048575,
      h = a.directiveStart,
      g = a.providerIndexes >> 20;
    if (Xn(e) || !e.multi) {
      let p = new cr(c, o, I, null),
        x = oh(l, t, o ? d : d + g, h);
      x === -1
        ? (sh(Ba(a, s), i, l),
          rh(i, e, t.length),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(p),
          s.push(p))
        : ((n[x] = p), (s[x] = p));
    } else {
      let p = oh(l, t, d + g, h),
        x = oh(l, t, d, d + g),
        R = p >= 0 && n[p],
        L = x >= 0 && n[x];
      if ((o && !L) || (!o && !R)) {
        sh(Ba(a, s), i, l);
        let Z = yx(o ? kx : mx, n.length, o, r, c, e);
        (!o && L && (n[x].providerFactory = Z),
          rh(i, e, t.length, 0),
          t.push(l),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(Z),
          s.push(Z));
      } else {
        let Z = Lg(n[o ? x : p], c, !o && r);
        rh(i, e, p > -1 ? p : x, Z);
      }
      !o && r && L && n[x].componentProviders++;
    }
  }
}
function rh(e, t, n, r) {
  let o = Xn(t),
    i = Y0(t);
  if (o || i) {
    let l = (i ? Ee(t.useClass) : t).prototype.ngOnDestroy;
    if (l) {
      let c = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let d = c.indexOf(n);
        d === -1 ? c.push(n, [r, l]) : c[d + 1].push(r, l);
      } else c.push(n, l);
    }
  }
}
function Lg(e, t, n) {
  return (n && e.componentProviders++, e.multi.push(t) - 1);
}
function oh(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function mx(e, t, n, r, o) {
  return Th(this.multi, []);
}
function kx(e, t, n, r, o) {
  let i = this.multi,
    s;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      l = mi(r, r[B], this.providerFactory.index, o);
    ((s = l.slice(0, a)), Th(i, s));
    for (let c = a; c < l.length; c++) s.push(l[c]);
  } else ((s = []), Th(i, s));
  return s;
}
function Th(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function yx(e, t, n, r, o, i) {
  let s = new cr(e, n, I, null);
  return ((s.multi = []), (s.index = t), (s.componentProviders = 0), Lg(s, o, r && !n), s);
}
function qe(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => wx(r, o ? o(e) : e, t);
  };
}
function bi() {
  return () => {
    C2(new qa());
  };
}
function fu(e, t, n, r, o) {
  return _x(K(), Vd(), e, t, n, r, o);
}
function sl(e, t, n, r, o, i) {
  return xx(K(), Vd(), e, t, n, r, o, i);
}
function Fg(e, t) {
  let n = e[t];
  return n === cn ? void 0 : n;
}
function _x(e, t, n, r, o, i, s) {
  let a = t + n;
  return pg(e, a, o, i) ? ug(e, a + 2, s ? r.call(s, o, i) : r(o, i)) : Fg(e, a + 2);
}
function xx(e, t, n, r, o, i, s, a) {
  let l = t + n;
  return Ly(e, l, o, i, s) ? ug(e, l + 3, a ? r.call(a, o, i, s) : r(o, i, s)) : Fg(e, l + 3);
}
var Ya = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) {
      ((this.ngModuleFactory = t), (this.componentFactories = n));
    }
  },
  vu = (() => {
    class e {
      compileModuleSync(n) {
        return new za(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = _d(n),
          i = O1(o.declarations).reduce((s, a) => {
            let l = tn(a);
            return (l && s.push(new dr(l)), s);
          }, []);
        return new Ya(r, i);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var Mx = (() => {
  class e {
    zone = u(X);
    changeDetectionScheduler = u(xt);
    applicationRef = u(vt);
    applicationErrorHandler = u(ut);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
          next: () => {
            this.changeDetectionScheduler.runningTick ||
              this.zone.run(() => {
                try {
                  ((this.applicationRef.dirtyFlags |= 1), this.applicationRef._tick());
                } catch (n) {
                  this.applicationErrorHandler(n);
                }
              });
          },
        }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function Vg({ ngZoneFactory: e, ignoreChangesOutsideZone: t, scheduleInRootZone: n }) {
  return (
    (e ??= () => new X(F(w({}, Hg()), { scheduleInRootZone: n }))),
    [
      { provide: X, useFactory: e },
      {
        provide: _n,
        multi: !0,
        useFactory: () => {
          let r = u(Mx, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: _n,
        multi: !0,
        useFactory: () => {
          let r = u(Cx);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: Zd, useValue: !0 } : [],
      { provide: Ea, useValue: n ?? _g },
      {
        provide: ut,
        useFactory: () => {
          let r = u(X),
            o = u(ke),
            i;
          return (s) => {
            r.runOutsideAngular(() => {
              o.destroyed && !i
                ? setTimeout(() => {
                    throw s;
                  })
                : ((i ??= o.get(it)), i.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function Hg(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var Cx = (() => {
  class e {
    subscription = new J();
    initialized = !1;
    zone = u(X);
    pendingTasks = u(on);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      (!this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              (X.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                }));
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            (X.assertInAngularZone(), (n ??= this.pendingTasks.add()));
          }),
        ));
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var wu = (() => {
  class e {
    applicationErrorHandler = u(ut);
    appRef = u(vt);
    taskService = u(on);
    ngZone = u(X);
    zonelessEnabled = u(pi);
    tracing = u(fr, { optional: !0 });
    disableScheduling = u(Zd, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new J();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get($a) : null;
    scheduleInRootZone =
      !this.zonelessEnabled && this.zoneIsDefined && (u(Ea, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled && (this.ngZone instanceof _i || !this.zoneIsDefined)));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      let r = !1;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 12: {
          ((this.appRef.dirtyFlags |= 16), (r = !0));
          break;
        }
        case 13: {
          ((this.appRef.dirtyFlags |= 2), (r = !0));
          break;
        }
        case 11: {
          r = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? Y2 : xg;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick()),
            )));
    }
    shouldScheduleTick(n) {
      return !(
        (this.disableScheduling && !n) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get($a + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        (this.taskService.remove(n), this.applicationErrorHandler(r));
      } finally {
        this.cleanup();
      }
      ((this.useMicrotaskScheduler = !0),
        Y2(() => {
          ((this.useMicrotaskScheduler = !1), this.taskService.remove(n));
        }));
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(n));
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function mu() {
  return (
    gr('NgZoneless'),
    ni([
      { provide: xt, useExisting: wu },
      { provide: X, useClass: _i },
      { provide: pi, useValue: !0 },
      { provide: Ea, useValue: !1 },
      [],
    ])
  );
}
function Dx() {
  return (typeof $localize < 'u' && $localize.locale) || Di;
}
var al = new _('', {
  providedIn: 'root',
  factory: () => u(al, { optional: !0, skipSelf: !0 }) || Dx(),
});
function Ce(e) {
  return P0(e);
}
function ue(e, t) {
  return Ss(e, t?.equal);
}
var ku = class {
  [Ae];
  constructor(t) {
    this[Ae] = t;
  }
  destroy() {
    this[Ae].destroy();
  }
};
function On(e, t) {
  let n = t?.injector ?? u(pe),
    r = t?.manualCleanup !== !0 ? n.get(ht) : null,
    o,
    i = n.get(oo, null, { optional: !0 }),
    s = n.get(xt);
  return (
    i !== null
      ? ((o = Sx(i.view, s, e)), r instanceof Jo && r._lView === i.view && (r = null))
      : (o = Ix(e, n.get(gi), s)),
    (o.injector = n),
    r !== null && (o.onDestroyFn = r.onDestroy(() => o.destroy())),
    new ku(o)
  );
}
var Ug = F(w({}, fn), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    dirty: !0,
    hasRun: !1,
    cleanupFns: void 0,
    zone: null,
    kind: 'effect',
    onDestroyFn: ar,
    run() {
      if (((this.dirty = !1), this.hasRun && !Ir(this))) return;
      this.hasRun = !0;
      let e = (r) => (this.cleanupFns ??= []).push(r),
        t = vn(this),
        n = ro(!1);
      try {
        (this.maybeCleanup(), this.fn(e));
      } finally {
        (ro(n), Un(this, t));
      }
    },
    maybeCleanup() {
      if (!this.cleanupFns?.length) return;
      let e = V(null);
      try {
        for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
      } finally {
        ((this.cleanupFns = []), V(e));
      }
    },
  }),
  bx = F(w({}, Ug), {
    consumerMarkedDirty() {
      (this.scheduler.schedule(this), this.notifier.notify(12));
    },
    destroy() {
      (zn(this), this.onDestroyFn(), this.maybeCleanup(), this.scheduler.remove(this));
    },
  }),
  Ex = F(w({}, Ug), {
    consumerMarkedDirty() {
      ((this.view[N] |= 8192), Dn(this.view), this.notifier.notify(13));
    },
    destroy() {
      (zn(this), this.onDestroyFn(), this.maybeCleanup(), this.view[rn]?.delete(this));
    },
  });
function Sx(e, t, n) {
  let r = Object.create(Ex);
  return (
    (r.view = e),
    (r.zone = typeof Zone < 'u' ? Zone.current : null),
    (r.notifier = t),
    (r.fn = n),
    (e[rn] ??= new Set()),
    e[rn].add(r),
    r.consumerMarkedDirty(r),
    r
  );
}
function Ix(e, t, n) {
  let r = Object.create(bx);
  return (
    (r.fn = e),
    (r.scheduler = t),
    (r.notifier = n),
    (r.zone = typeof Zone < 'u' ? Zone.current : null),
    r.scheduler.add(r),
    r.notifier.notify(12),
    r
  );
}
var Zg = Symbol('InputSignalNode#UNSET'),
  Qx = F(w({}, Is), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
      Ar(e, t);
    },
  });
function Yg(e, t) {
  let n = Object.create(Qx);
  ((n.value = e), (n.transformFn = t?.transform));
  function r() {
    if ((Sr(n), n.value === Zg)) {
      let o = null;
      throw new b(-950, o);
    }
    return n.value;
  }
  return ((r[Ae] = n), r);
}
var Si = class {
    attributeName;
    constructor(t) {
      this.attributeName = t;
    }
    __NG_ELEMENT_ID__ = () => Ph(this.attributeName);
    toString() {
      return `HostAttributeToken ${this.attributeName}`;
    }
  },
  Xx = new _('');
Xx.__NG_ELEMENT_ID__ = (e) => {
  let t = ye();
  if (t === null) throw new b(204, !1);
  if (t.type & 2) return t.value;
  if (e & 8) return null;
  throw new b(204, !1);
};
function zg(e, t) {
  return Yg(e, t);
}
function Jx(e) {
  return Yg(Zg, e);
}
var Nn = ((zg.required = Jx), zg);
var yu = new _(''),
  e3 = new _('');
function Ei(e) {
  return !e.moduleRef;
}
function t3(e) {
  let t = Ei(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(X);
  return n.run(() => {
    Ei(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(ut),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: r });
      }),
      Ei(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(yu);
      (s.add(i),
        t.onDestroy(() => {
          (o.unsubscribe(), s.delete(i));
        }));
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(yu);
      (s.add(i),
        e.moduleRef.onDestroy(() => {
          (vi(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i));
        }));
    }
    return r3(r, n, () => {
      let i = t.get(on),
        s = i.add(),
        a = t.get(uu);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let l = t.get(al, Di);
            if ((Ng(l || Di), !t.get(e3, !0)))
              return Ei(e) ? t.get(vt) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (Ei(e)) {
              let d = t.get(vt);
              return (e.rootComponent !== void 0 && d.bootstrap(e.rootComponent), d);
            } else return (n3?.(e.moduleRef, e.allPlatformModules), e.moduleRef);
          })
          .finally(() => void i.remove(s))
      );
    });
  });
}
var n3;
function r3(e, t, n) {
  try {
    let r = n();
    return An(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e(r)), r);
  }
}
var ll = null;
function o3(e = [], t) {
  return pe.create({
    name: t,
    providers: [
      { provide: ri, useValue: 'platform' },
      { provide: yu, useValue: new Set([() => (ll = null)]) },
      ...e,
    ],
  });
}
function i3(e = []) {
  if (ll) return ll;
  let t = o3(e);
  return ((ll = t), Eg(), s3(t), t);
}
function s3(e) {
  let t = e.get(Ka, null);
  Se(e, () => {
    t?.forEach((n) => n());
  });
}
var wt = (() => {
  class e {
    static __NG_ELEMENT_ID__ = a3;
  }
  return e;
})();
function a3(e) {
  return l3(ye(), K(), (e & 16) === 16);
}
function l3(e, t, n) {
  if (Cn(e) && !n) {
    let r = dt(e.index, t);
    return new Sn(r, r);
  } else if (e.type & 175) {
    let r = t[lt];
    return new Sn(r, t);
  }
  return null;
}
var _u = class {
    constructor() {}
    supports(t) {
      return ou(t);
    }
    create(t) {
      return new xu(t);
    }
  },
  c3 = (e, t) => t,
  xu = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(t) {
      this._trackByFn = t || c3;
    }
    forEachItem(t) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) t(n);
    }
    forEachOperation(t) {
      let n = this._itHead,
        r = this._removalsHead,
        o = 0,
        i = null;
      for (; n || r; ) {
        let s = !r || (n && n.currentIndex < $g(r, o, i)) ? n : r,
          a = $g(s, o, i),
          l = s.currentIndex;
        if (s === r) (o--, (r = r._nextRemoved));
        else if (((n = n._next), s.previousIndex == null)) o++;
        else {
          i || (i = []);
          let c = a - o,
            d = l - o;
          if (c != d) {
            for (let g = 0; g < c; g++) {
              let p = g < i.length ? i[g] : (i[g] = 0),
                x = p + g;
              d <= x && x < c && (i[g] = p + 1);
            }
            let h = s.previousIndex;
            i[h] = d - c;
          }
        }
        a !== l && t(s, a, l);
      }
    }
    forEachPreviousItem(t) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) t(n);
    }
    forEachAddedItem(t) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
    }
    forEachMovedItem(t) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) t(n);
    }
    forEachRemovedItem(t) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
    }
    forEachIdentityChange(t) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange) t(n);
    }
    diff(t) {
      if ((t == null && (t = []), !ou(t))) throw new b(900, !1);
      return this.check(t) ? this : null;
    }
    onDestroy() {}
    check(t) {
      this._reset();
      let n = this._itHead,
        r = !1,
        o,
        i,
        s;
      if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
          ((i = t[a]),
            (s = this._trackByFn(a, i)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, i, s, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, i, s, a)),
                Object.is(n.item, i) || this._addIdentityChange(n, i)),
            (n = n._next));
      } else
        ((o = 0),
          dg(t, (a) => {
            ((s = this._trackByFn(o, a)),
              n === null || !Object.is(n.trackById, s)
                ? ((n = this._mismatch(n, a, s, o)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, s, o)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              o++);
          }),
          (this.length = o));
      return (this._truncate(n), (this.collection = t), this.isDirty);
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
          t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
          t.previousIndex = t.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, t = this._movesHead;
          t !== null;
          t = t._nextMoved
        )
          t.previousIndex = t.currentIndex;
        ((this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null));
      }
    }
    _mismatch(t, n, r, o) {
      let i;
      return (
        t === null ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
        (t = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null)),
        t !== null
          ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o))
          : ((t = this._linkedRecords === null ? null : this._linkedRecords.get(r, o)),
            t !== null
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o))
              : (t = this._addAfter(new Mu(n, r), i, o))),
        t
      );
    }
    _verifyReinsertion(t, n, r, o) {
      let i = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null);
      return (
        i !== null
          ? (t = this._reinsertAfter(i, t._prev, o))
          : t.currentIndex != o && ((t.currentIndex = o), this._addToMoves(t, o)),
        t
      );
    }
    _truncate(t) {
      for (; t !== null; ) {
        let n = t._next;
        (this._addToRemovals(this._unlink(t)), (t = n));
      }
      (this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null));
    }
    _reinsertAfter(t, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
      let o = t._prevRemoved,
        i = t._nextRemoved;
      return (
        o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
        i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
        this._insertAfter(t, n, r),
        this._addToMoves(t, r),
        t
      );
    }
    _moveAfter(t, n, r) {
      return (this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t);
    }
    _addAfter(t, n, r) {
      return (
        this._insertAfter(t, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = t)
          : (this._additionsTail = this._additionsTail._nextAdded = t),
        t
      );
    }
    _insertAfter(t, n, r) {
      let o = n === null ? this._itHead : n._next;
      return (
        (t._next = o),
        (t._prev = n),
        o === null ? (this._itTail = t) : (o._prev = t),
        n === null ? (this._itHead = t) : (n._next = t),
        this._linkedRecords === null && (this._linkedRecords = new cl()),
        this._linkedRecords.put(t),
        (t.currentIndex = r),
        t
      );
    }
    _remove(t) {
      return this._addToRemovals(this._unlink(t));
    }
    _unlink(t) {
      this._linkedRecords !== null && this._linkedRecords.remove(t);
      let n = t._prev,
        r = t._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        t
      );
    }
    _addToMoves(t, n) {
      return (
        t.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = t)
            : (this._movesTail = this._movesTail._nextMoved = t)),
        t
      );
    }
    _addToRemovals(t) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new cl()),
        this._unlinkedRecords.put(t),
        (t.currentIndex = null),
        (t._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = t), (t._prevRemoved = null))
          : ((t._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = t)),
        t
      );
    }
    _addIdentityChange(t, n) {
      return (
        (t.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = t)
          : (this._identityChangesTail = this._identityChangesTail._nextIdentityChange = t),
        t
      );
    }
  },
  Mu = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(t, n) {
      ((this.item = t), (this.trackById = n));
    }
  },
  Cu = class {
    _head = null;
    _tail = null;
    add(t) {
      this._head === null
        ? ((this._head = this._tail = t), (t._nextDup = null), (t._prevDup = null))
        : ((this._tail._nextDup = t),
          (t._prevDup = this._tail),
          (t._nextDup = null),
          (this._tail = t));
    }
    get(t, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
      return null;
    }
    remove(t) {
      let n = t._prevDup,
        r = t._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  cl = class {
    map = new Map();
    put(t) {
      let n = t.trackById,
        r = this.map.get(n);
      (r || ((r = new Cu()), this.map.set(n, r)), r.add(t));
    }
    get(t, n) {
      let r = t,
        o = this.map.get(r);
      return o ? o.get(t, n) : null;
    }
    remove(t) {
      let n = t.trackById;
      return (this.map.get(n).remove(t) && this.map.delete(n), t);
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function $g(e, t, n) {
  let r = e.previousIndex;
  if (r === null) return r;
  let o = 0;
  return (n && r < n.length && (o = n[r]), r + t + o);
}
function Gg() {
  return new dl([new _u()]);
}
var dl = (() => {
  class e {
    factories;
    static ɵprov = y({ token: e, providedIn: 'root', factory: Gg });
    constructor(n) {
      this.factories = n;
    }
    static create(n, r) {
      if (r != null) {
        let o = r.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (r) => e.create(n, r || Gg()),
        deps: [[e, new s1(), new Ah()]],
      };
    }
    find(n) {
      let r = this.factories.find((o) => o.supports(n));
      if (r != null) return r;
      throw new b(901, !1);
    }
  }
  return e;
})();
function Kg(e) {
  re(8);
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = i3(r),
      i = [Vg({}), { provide: xt, useExisting: wu }, D2, ...(n || [])],
      s = new yi({ providers: i, parent: o, debugName: '', runEnvironmentInitializers: !1 });
    return t3({ r3Injector: s.injector, platformInjector: o, rootComponent: t });
  } catch (t) {
    return Promise.reject(t);
  } finally {
    re(9);
  }
}
function et(e) {
  return typeof e == 'boolean' ? e : e != null && e !== 'false';
}
function Du(e, t = NaN) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
function Qg(e, t) {
  let n = tn(e),
    r = t.elementInjector || Qr();
  return new dr(n).create(
    r,
    t.projectableNodes,
    t.hostElement,
    t.environmentInjector,
    t.directives,
    t.bindings,
  );
}
var ef = null;
function mt() {
  return ef;
}
function bu(e) {
  ef ??= e;
}
var Ii = class {},
  Eu = (() => {
    class e {
      historyGo(n) {
        throw new Error('');
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: () => u(tf), providedIn: 'platform' });
    }
    return e;
  })();
var tf = (() => {
  class e extends Eu {
    _location;
    _history;
    _doc = u(de);
    constructor() {
      (super(), (this._location = window.location), (this._history = window.history));
    }
    getBaseHrefFromDOM() {
      return mt().getBaseHref(this._doc);
    }
    onPopState(n) {
      let r = mt().getGlobalEventTarget(this._doc, 'window');
      return (r.addEventListener('popstate', n, !1), () => r.removeEventListener('popstate', n));
    }
    onHashChange(n) {
      let r = mt().getGlobalEventTarget(this._doc, 'window');
      return (
        r.addEventListener('hashchange', n, !1),
        () => r.removeEventListener('hashchange', n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, r, o) {
      this._history.pushState(n, r, o);
    }
    replaceState(n, r, o) {
      this._history.replaceState(n, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: () => new e(), providedIn: 'platform' });
  }
  return e;
})();
function nf(e, t) {
  return e
    ? t
      ? e.endsWith('/')
        ? t.startsWith('/')
          ? e + t.slice(1)
          : e + t
        : t.startsWith('/')
          ? e + t
          : `${e}/${t}`
      : e
    : t;
}
function Xg(e) {
  let t = e.search(/#|\?|$/);
  return e[t - 1] === '/' ? e.slice(0, t - 1) + e.slice(t) : e;
}
function jn(e) {
  return e && e[0] !== '?' ? `?${e}` : e;
}
var hl = (() => {
    class e {
      historyGo(n) {
        throw new Error('');
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: () => u(of), providedIn: 'root' });
    }
    return e;
  })(),
  rf = new _(''),
  of = (() => {
    class e extends hl {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(n, r) {
        (super(),
          (this._platformLocation = n),
          (this._baseHref =
            r ?? this._platformLocation.getBaseHrefFromDOM() ?? u(de).location?.origin ?? ''));
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return nf(this._baseHref, n);
      }
      path(n = !1) {
        let r = this._platformLocation.pathname + jn(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${r}${o}` : r;
      }
      pushState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + jn(i));
        this._platformLocation.pushState(n, r, s);
      }
      replaceState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + jn(i));
        this._platformLocation.replaceState(n, r, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(Eu), O(rf, 8));
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  vo = (() => {
    class e {
      _subject = new P();
      _basePath;
      _locationStrategy;
      _urlChangeListeners = [];
      _urlChangeSubscription = null;
      constructor(n) {
        this._locationStrategy = n;
        let r = this._locationStrategy.getBaseHref();
        ((this._basePath = u3(Xg(Jg(r)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.next({ url: this.path(!0), pop: !0, state: o.state, type: o.type });
          }));
      }
      ngOnDestroy() {
        (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []));
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, r = '') {
        return this.path() == this.normalize(n + jn(r));
      }
      normalize(n) {
        return e.stripTrailingSlash(h3(this._basePath, Jg(n)));
      }
      prepareExternalUrl(n) {
        return (n && n[0] !== '/' && (n = '/' + n), this._locationStrategy.prepareExternalUrl(n));
      }
      go(n, r = '', o = null) {
        (this._locationStrategy.pushState(o, '', n, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + jn(r)), o));
      }
      replaceState(n, r = '', o = null) {
        (this._locationStrategy.replaceState(o, '', n, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + jn(r)), o));
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((r) => {
            this._notifyUrlChangeListeners(r.url, r.state);
          })),
          () => {
            let r = this._urlChangeListeners.indexOf(n);
            (this._urlChangeListeners.splice(r, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null)));
          }
        );
      }
      _notifyUrlChangeListeners(n = '', r) {
        this._urlChangeListeners.forEach((o) => o(n, r));
      }
      subscribe(n, r, o) {
        return this._subject.subscribe({ next: n, error: r ?? void 0, complete: o ?? void 0 });
      }
      static normalizeQueryParams = jn;
      static joinWithSlash = nf;
      static stripTrailingSlash = Xg;
      static ɵfac = function (r) {
        return new (r || e)(O(hl));
      };
      static ɵprov = y({ token: e, factory: () => d3(), providedIn: 'root' });
    }
    return e;
  })();
function d3() {
  return new vo(O(hl));
}
function h3(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === '' || ['/', ';', '?', '#'].includes(n[0]) ? n : t;
}
function Jg(e) {
  return e.replace(/\/index.html$/, '');
}
function u3(e) {
  if (new RegExp('^(https?:)?//').test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
var Su = /\s+/,
  sf = [],
  Iu = (() => {
    class e {
      _ngEl;
      _renderer;
      initialClasses = sf;
      rawClass;
      stateMap = new Map();
      constructor(n, r) {
        ((this._ngEl = n), (this._renderer = r));
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(Su) : sf;
      }
      set ngClass(n) {
        this.rawClass = typeof n == 'string' ? n.trim().split(Su) : n;
      }
      ngDoCheck() {
        for (let r of this.initialClasses) this._updateState(r, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set) for (let r of n) this._updateState(r, !0);
        else if (n != null) for (let r of Object.keys(n)) this._updateState(r, !!n[r]);
        this._applyStateDiff();
      }
      _updateState(n, r) {
        let o = this.stateMap.get(n);
        o !== void 0
          ? (o.enabled !== r && ((o.changed = !0), (o.enabled = r)), (o.touched = !0))
          : this.stateMap.set(n, { enabled: r, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let r = n[0],
            o = n[1];
          (o.changed
            ? (this._toggleClass(r, o.enabled), (o.changed = !1))
            : o.touched || (o.enabled && this._toggleClass(r, !1), this.stateMap.delete(r)),
            (o.touched = !1));
        }
      }
      _toggleClass(n, r) {
        ((n = n.trim()),
          n.length > 0 &&
            n.split(Su).forEach((o) => {
              r
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            }));
      }
      static ɵfac = function (r) {
        return new (r || e)(I(ge), I(pt));
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'ngClass', '']],
        inputs: { klass: [0, 'class', 'klass'], ngClass: 'ngClass' },
      });
    }
    return e;
  })();
var ul = class {
    $implicit;
    ngForOf;
    index;
    count;
    constructor(t, n, r, o) {
      ((this.$implicit = t), (this.ngForOf = n), (this.index = r), (this.count = o));
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  Wt = (() => {
    class e {
      _viewContainer;
      _template;
      _differs;
      set ngForOf(n) {
        ((this._ngForOf = n), (this._ngForOfDirty = !0));
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      _ngForOf = null;
      _ngForOfDirty = !0;
      _differ = null;
      _trackByFn;
      constructor(n, r, o) {
        ((this._viewContainer = n), (this._template = r), (this._differs = o));
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          !this._differ && n && (this._differ = this._differs.find(n).create(this.ngForTrackBy));
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let r = this._viewContainer;
        n.forEachOperation((o, i, s) => {
          if (o.previousIndex == null)
            r.createEmbeddedView(
              this._template,
              new ul(o.item, this._ngForOf, -1, -1),
              s === null ? void 0 : s,
            );
          else if (s == null) r.remove(i === null ? void 0 : i);
          else if (i !== null) {
            let a = r.get(i);
            (r.move(a, s), af(a, o));
          }
        });
        for (let o = 0, i = r.length; o < i; o++) {
          let a = r.get(o).context;
          ((a.index = o), (a.count = i), (a.ngForOf = this._ngForOf));
        }
        n.forEachIdentityChange((o) => {
          let i = r.get(o.currentIndex);
          af(i, o);
        });
      }
      static ngTemplateContextGuard(n, r) {
        return !0;
      }
      static ɵfac = function (r) {
        return new (r || e)(I(gt), I(Gt), I(dl));
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'ngFor', '', 'ngForOf', '']],
        inputs: {
          ngForOf: 'ngForOf',
          ngForTrackBy: 'ngForTrackBy',
          ngForTemplate: 'ngForTemplate',
        },
      });
    }
    return e;
  })();
function af(e, t) {
  e.context.$implicit = t.item;
}
var Ve = (() => {
    class e {
      _viewContainer;
      _context = new pl();
      _thenTemplateRef = null;
      _elseTemplateRef = null;
      _thenViewRef = null;
      _elseViewRef = null;
      constructor(n, r) {
        ((this._viewContainer = n), (this._thenTemplateRef = r));
      }
      set ngIf(n) {
        ((this._context.$implicit = this._context.ngIf = n), this._updateView());
      }
      set ngIfThen(n) {
        (lf(n, !1), (this._thenTemplateRef = n), (this._thenViewRef = null), this._updateView());
      }
      set ngIfElse(n) {
        (lf(n, !1), (this._elseTemplateRef = n), (this._elseViewRef = null), this._updateView());
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context,
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context,
              )));
      }
      static ngIfUseIfTypeGuard;
      static ngTemplateGuard_ngIf;
      static ngTemplateContextGuard(n, r) {
        return !0;
      }
      static ɵfac = function (r) {
        return new (r || e)(I(gt), I(Gt));
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'ngIf', '']],
        inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
      });
    }
    return e;
  })(),
  pl = class {
    $implicit = null;
    ngIf = null;
  };
function lf(e, t) {
  if (e && !e.createEmbeddedView) throw new b(2020, !1);
}
var ve = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Fe({ type: e });
    static ɵinj = Pe({});
  }
  return e;
})();
function Tu(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(';')) {
    let r = n.indexOf('='),
      [o, i] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Ti = class {};
var Au = 'browser',
  p3 = 'server';
function cf(e) {
  return e === Au;
}
function df(e) {
  return e === p3;
}
var fl = new _(''),
  ju = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(n, r) {
        ((this._zone = r),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse()));
      }
      addEventListener(n, r, o, i) {
        return this._findPluginFor(r).addEventListener(n, r, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(n))), !r)) throw new b(5101, !1);
        return (this._eventNameToPlugin.set(n, r), r);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(fl), O(X));
      };
      static ɵprov = y({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Ai = class {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    manager;
  },
  Ru = 'ng-app-id';
function hf(e) {
  for (let t of e) t.remove();
}
function uf(e, t) {
  let n = t.createElement('style');
  return ((n.textContent = e), n);
}
function g3(e, t, n, r) {
  let o = e.head?.querySelectorAll(`style[${Ru}="${t}"],link[${Ru}="${t}"]`);
  if (o)
    for (let i of o)
      (i.removeAttribute(Ru),
        i instanceof HTMLLinkElement
          ? r.set(i.href.slice(i.href.lastIndexOf('/') + 1), { usage: 0, elements: [i] })
          : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] }));
}
function Ou(e, t) {
  let n = t.createElement('link');
  return (n.setAttribute('rel', 'stylesheet'), n.setAttribute('href', e), n);
}
var Bu = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(n, r, o, i = {}) {
        ((this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          g3(n, r, this.inline, this.external),
          this.hosts.add(n.head));
      }
      addStyles(n, r) {
        for (let o of n) this.addUsage(o, this.inline, uf);
        r?.forEach((o) => this.addUsage(o, this.external, Ou));
      }
      removeStyles(n, r) {
        for (let o of n) this.removeUsage(o, this.inline);
        r?.forEach((o) => this.removeUsage(o, this.external));
      }
      addUsage(n, r, o) {
        let i = r.get(n);
        i
          ? i.usage++
          : r.set(n, {
              usage: 1,
              elements: [...this.hosts].map((s) => this.addElement(s, o(n, this.doc))),
            });
      }
      removeUsage(n, r) {
        let o = r.get(n);
        o && (o.usage--, o.usage <= 0 && (hf(o.elements), r.delete(n)));
      }
      ngOnDestroy() {
        for (let [, { elements: n }] of [...this.inline, ...this.external]) hf(n);
        this.hosts.clear();
      }
      addHost(n) {
        this.hosts.add(n);
        for (let [r, { elements: o }] of this.inline) o.push(this.addElement(n, uf(r, this.doc)));
        for (let [r, { elements: o }] of this.external) o.push(this.addElement(n, Ou(r, this.doc)));
      }
      removeHost(n) {
        this.hosts.delete(n);
      }
      addElement(n, r) {
        return (this.nonce && r.setAttribute('nonce', this.nonce), n.appendChild(r));
      }
      static ɵfac = function (r) {
        return new (r || e)(O(de), O(fo), O(Qa, 8), O(qt));
      };
      static ɵprov = y({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Pu = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  Lu = /%COMP%/g;
var gf = '%COMP%',
  f3 = `_nghost-${gf}`,
  v3 = `_ngcontent-${gf}`,
  w3 = !0,
  m3 = new _('', { providedIn: 'root', factory: () => w3 });
function k3(e) {
  return v3.replace(Lu, e);
}
function y3(e) {
  return f3.replace(Lu, e);
}
function ff(e, t) {
  return t.map((n) => n.replace(Lu, e));
}
var Fu = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      animationDisabled;
      maxAnimationTimeout;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      registry;
      constructor(n, r, o, i, s, a, l, c = null, d, h, g = null) {
        ((this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = l),
          (this.nonce = c),
          (this.animationDisabled = d),
          (this.maxAnimationTimeout = h),
          (this.tracingService = g),
          (this.platformIsServer = !1),
          (this.defaultRenderer = new Ri(
            n,
            s,
            l,
            this.platformIsServer,
            this.tracingService,
            (this.registry = ui()),
            this.maxAnimationTimeout,
          )));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        let o = this.getOrCreateRenderer(n, r);
        return (o instanceof gl ? o.applyToHost(n) : o instanceof Pi && o.applyStyles(), o);
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            l = this.eventManager,
            c = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            h = this.platformIsServer,
            g = this.tracingService;
          switch (r.encapsulation) {
            case ln.Emulated:
              i = new gl(
                l,
                c,
                r,
                this.appId,
                d,
                s,
                a,
                h,
                g,
                this.registry,
                this.animationDisabled,
                this.maxAnimationTimeout,
              );
              break;
            case ln.ShadowDom:
              return new Nu(
                l,
                c,
                n,
                r,
                s,
                a,
                this.nonce,
                h,
                g,
                this.registry,
                this.maxAnimationTimeout,
              );
            default:
              i = new Pi(
                l,
                c,
                r,
                d,
                s,
                a,
                h,
                g,
                this.registry,
                this.animationDisabled,
                this.maxAnimationTimeout,
              );
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(n) {
        this.rendererByCompId.delete(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          O(ju),
          O(Bu),
          O(fo),
          O(m3),
          O(de),
          O(qt),
          O(X),
          O(Qa),
          O(il),
          O(pu),
          O(fr, 8),
        );
      };
      static ɵprov = y({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Ri = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    tracingService;
    registry;
    maxAnimationTimeout;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(t, n, r, o, i, s, a) {
      ((this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.tracingService = i),
        (this.registry = s),
        (this.maxAnimationTimeout = a));
    }
    destroy() {}
    destroyNode = null;
    createElement(t, n) {
      return n ? this.doc.createElementNS(Pu[n] || n, t) : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (pf(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (pf(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      let { elements: r } = this.registry;
      if (r) {
        r.animate(n, () => n.remove(), this.maxAnimationTimeout);
        return;
      }
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == 'string' ? this.doc.querySelector(t) : t;
      if (!r) throw new b(-5104, !1);
      return (n || (r.textContent = ''), r);
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ':' + n;
        let i = Pu[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Pu[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & ($t.DashCase | $t.Important)
        ? t.style.setProperty(n, r, o & $t.Important ? 'important' : '')
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & $t.DashCase ? t.style.removeProperty(n) : (t.style[n] = '');
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r, o) {
      if (typeof t == 'string' && ((t = mt().getGlobalEventTarget(this.doc, t)), !t))
        throw new b(5102, !1);
      let i = this.decoratePreventDefault(r);
      return (
        this.tracingService?.wrapEventListener &&
          (i = this.tracingService.wrapEventListener(t, n, i)),
        this.eventManager.addEventListener(t, n, i, o)
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === '__ngUnwrap__') return t;
        t(n) === !1 && n.preventDefault();
      };
    }
  };
function pf(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0;
}
var Nu = class extends Ri {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(t, n, r, o, i, s, a, l, c, d, h) {
      (super(t, i, s, l, c, d, h),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot));
      let g = o.styles;
      g = ff(o.id, g);
      for (let x of g) {
        let R = document.createElement('style');
        (a && R.setAttribute('nonce', a), (R.textContent = x), this.shadowRoot.appendChild(R));
      }
      let p = o.getExternalStyles?.();
      if (p)
        for (let x of p) {
          let R = Ou(x, i);
          (a && R.setAttribute('nonce', a), this.shadowRoot.appendChild(R));
        }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Pi = class extends Ri {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    _animationDisabled;
    constructor(t, n, r, o, i, s, a, l, c, d, h, g) {
      (super(t, i, s, a, l, c, h),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this._animationDisabled = d));
      let p = r.styles;
      ((this.styles = g ? ff(g, p) : p), (this.styleUrls = r.getExternalStyles?.(g)));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      if (this.removeStylesOnCompDestroy) {
        if (!this._animationDisabled && this.registry.elements) {
          this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
            }, this.maxAnimationTimeout);
          });
          return;
        }
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
      }
    }
  },
  gl = class extends Pi {
    contentAttr;
    hostAttr;
    constructor(t, n, r, o, i, s, a, l, c, d, h, g) {
      let p = o + '-' + r.id;
      (super(t, n, r, i, s, a, l, c, d, h, g, p),
        (this.contentAttr = k3(p)),
        (this.hostAttr = y3(p)));
    }
    applyToHost(t) {
      (this.applyStyles(), this.setAttribute(t, this.hostAttr, ''));
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return (super.setAttribute(r, this.contentAttr, ''), r);
    }
  };
var vl = class e extends Ii {
    supportsDOMEvents = !0;
    static makeCurrent() {
      bu(new e());
    }
    onAndCancel(t, n, r, o) {
      return (
        t.addEventListener(n, r, o),
        () => {
          t.removeEventListener(n, r, o);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return ((n = n || this.getDefaultDocument()), n.createElement(t));
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === 'window' ? window : n === 'document' ? t : n === 'body' ? t.body : null;
    }
    getBaseHref(t) {
      let n = _3();
      return n == null ? null : x3(n);
    }
    resetBaseElement() {
      Oi = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Tu(document.cookie, t);
    }
  },
  Oi = null;
function _3() {
  return ((Oi = Oi || document.head.querySelector('base')), Oi ? Oi.getAttribute('href') : null);
}
function x3(e) {
  return new URL(e, document.baseURI).pathname;
}
var M3 = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  wf = (() => {
    class e extends Ai {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, o, i) {
        return (n.addEventListener(r, o, i), () => this.removeEventListener(n, r, o, i));
      }
      removeEventListener(n, r, o, i) {
        return n.removeEventListener(r, o, i);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(de));
      };
      static ɵprov = y({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  vf = ['alt', 'control', 'meta', 'shift'],
  C3 = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  D3 = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  mf = (() => {
    class e extends Ai {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, o, i) {
        let s = e.parseEventName(r),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => mt().onAndCancel(n, s.domEventName, a, i));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split('.'),
          o = r.shift();
        if (r.length === 0 || !(o === 'keydown' || o === 'keyup')) return null;
        let i = e._normalizeKey(r.pop()),
          s = '',
          a = r.indexOf('code');
        if (
          (a > -1 && (r.splice(a, 1), (s = 'code.')),
          vf.forEach((c) => {
            let d = r.indexOf(c);
            d > -1 && (r.splice(d, 1), (s += c + '.'));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let l = {};
        return ((l.domEventName = o), (l.fullKey = s), l);
      }
      static matchEventFullKeyCode(n, r) {
        let o = C3[n.key] || n.key,
          i = '';
        return (
          r.indexOf('code.') > -1 && ((o = n.code), (i = 'code.')),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === ' ' ? (o = 'space') : o === '.' && (o = 'dot'),
              vf.forEach((s) => {
                if (s !== o) {
                  let a = D3[s];
                  a(n) && (i += s + '.');
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(n, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(n) {
        return n === 'esc' ? 'escape' : n;
      }
      static ɵfac = function (r) {
        return new (r || e)(O(de));
      };
      static ɵprov = y({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Vu(e, t) {
  let n = w({ rootComponent: e }, b3(t));
  return Kg(n);
}
function b3(e) {
  return { appProviders: [...A3, ...(e?.providers ?? [])], platformProviders: T3 };
}
function E3() {
  vl.makeCurrent();
}
function S3() {
  return new it();
}
function I3() {
  return (Nh(document), document);
}
var T3 = [
  { provide: qt, useValue: Au },
  { provide: Ka, useValue: E3, multi: !0 },
  { provide: de, useFactory: I3 },
];
var A3 = [
  { provide: ri, useValue: 'root' },
  { provide: it, useFactory: S3 },
  { provide: fl, useClass: wf, multi: !0, deps: [de] },
  { provide: fl, useClass: mf, multi: !0, deps: [de] },
  Fu,
  Bu,
  ju,
  { provide: Je, useExisting: Fu },
  { provide: Ti, useClass: M3 },
  [],
];
var kf = (() => {
  class e {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || '';
    }
    static ɵfac = function (r) {
      return new (r || e)(O(de));
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var z = 'primary',
  Yi = Symbol('RouteTitle'),
  Gu = class {
    params;
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Mr(e) {
  return new Gu(e);
}
function Ef(e, t, n) {
  let r = n.path.split('/');
  if (r.length > e.length || (n.pathMatch === 'full' && (t.hasChildren() || r.length < e.length)))
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      a = e[i];
    if (s[0] === ':') o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function P3(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!Zt(e[n], t[n])) return !1;
  return !0;
}
function Zt(e, t) {
  let n = e ? qu(e) : void 0,
    r = t ? qu(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++) if (((o = n[i]), !Sf(e[o], t[o]))) return !1;
  return !0;
}
function qu(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function Sf(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function If(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function pn(e) {
  return $r(e) ? e : An(e) ? ce(Promise.resolve(e)) : j(e);
}
var O3 = { exact: Af, subset: Rf },
  Tf = { exact: N3, subset: j3, ignored: () => !0 };
function yf(e, t, n) {
  return (
    O3[n.paths](e.root, t.root, n.matrixParams) &&
    Tf[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === 'exact' && e.fragment !== t.fragment)
  );
}
function N3(e, t) {
  return Zt(e, t);
}
function Af(e, t, n) {
  if (
    !_r(e.segments, t.segments) ||
    !kl(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children) if (!e.children[r] || !Af(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function j3(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every((n) => Sf(e[n], t[n]))
  );
}
function Rf(e, t, n) {
  return Pf(e, t, t.segments, n);
}
function Pf(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!_r(o, n) || t.hasChildren() || !kl(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!_r(e.segments, n) || !kl(e.segments, n, r)) return !1;
    for (let o in t.children) if (!e.children[o] || !Rf(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !_r(e.segments, o) || !kl(e.segments, o, r) || !e.children[z]
      ? !1
      : Pf(e.children[z], t, i, r);
  }
}
function kl(e, t, n) {
  return t.every((r, o) => Tf[n](e[o].parameters, r.parameters));
}
var Kt = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(t = new ee([], {}), n = {}, r = null) {
      ((this.root = t), (this.queryParams = n), (this.fragment = r));
    }
    get queryParamMap() {
      return ((this._queryParamMap ??= Mr(this.queryParams)), this._queryParamMap);
    }
    toString() {
      return F3.serialize(this);
    }
  },
  ee = class {
    segments;
    children;
    parent = null;
    constructor(t, n) {
      ((this.segments = t),
        (this.children = n),
        Object.values(n).forEach((r) => (r.parent = this)));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return yl(this);
    }
  },
  Ln = class {
    path;
    parameters;
    _parameterMap;
    constructor(t, n) {
      ((this.path = t), (this.parameters = n));
    }
    get parameterMap() {
      return ((this._parameterMap ??= Mr(this.parameters)), this._parameterMap);
    }
    toString() {
      return Nf(this);
    }
  };
function B3(e, t) {
  return _r(e, t) && e.every((n, r) => Zt(n.parameters, t[r].parameters));
}
function _r(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function L3(e, t) {
  let n = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === z && (n = n.concat(t(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== z && (n = n.concat(t(o, r)));
    }),
    n
  );
}
var Ki = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: () => new Cr(), providedIn: 'root' });
    }
    return e;
  })(),
  Cr = class {
    parse(t) {
      let n = new Zu(t);
      return new Kt(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment());
    }
    serialize(t) {
      let n = `/${Ni(t.root, !0)}`,
        r = U3(t.queryParams),
        o = typeof t.fragment == 'string' ? `#${V3(t.fragment)}` : '';
      return `${n}${r}${o}`;
    }
  },
  F3 = new Cr();
function yl(e) {
  return e.segments.map((t) => Nf(t)).join('/');
}
function Ni(e, t) {
  if (!e.hasChildren()) return yl(e);
  if (t) {
    let n = e.children[z] ? Ni(e.children[z], !1) : '',
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== z && r.push(`${o}:${Ni(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join('//')})` : n
    );
  } else {
    let n = L3(e, (r, o) => (o === z ? [Ni(e.children[z], !1)] : [`${o}:${Ni(r, !1)}`]));
    return Object.keys(e.children).length === 1 && e.children[z] != null
      ? `${yl(e)}/${n[0]}`
      : `${yl(e)}/(${n.join('//')})`;
  }
}
function Of(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',');
}
function wl(e) {
  return Of(e).replace(/%3B/gi, ';');
}
function V3(e) {
  return encodeURI(e);
}
function Wu(e) {
  return Of(e).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function _l(e) {
  return decodeURIComponent(e);
}
function _f(e) {
  return _l(e.replace(/\+/g, '%20'));
}
function Nf(e) {
  return `${Wu(e.path)}${H3(e.parameters)}`;
}
function H3(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${Wu(t)}=${Wu(n)}`)
    .join('');
}
function U3(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r) ? r.map((o) => `${wl(n)}=${wl(o)}`).join('&') : `${wl(n)}=${wl(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join('&')}` : '';
}
var z3 = /^[^\/()?;#]+/;
function Hu(e) {
  let t = e.match(z3);
  return t ? t[0] : '';
}
var $3 = /^[^\/()?;=#]+/;
function G3(e) {
  let t = e.match($3);
  return t ? t[0] : '';
}
var q3 = /^[^=?&#]+/;
function W3(e) {
  let t = e.match(q3);
  return t ? t[0] : '';
}
var Z3 = /^[^&#]+/;
function Y3(e) {
  let t = e.match(Z3);
  return t ? t[0] : '';
}
var Zu = class {
  url;
  remaining;
  constructor(t) {
    ((this.url = t), (this.remaining = t));
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')
        ? new ee([], {})
        : new ee([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional('?'))
      do this.parseQueryParam(t);
      while (this.consumeOptional('&'));
    return t;
  }
  parseFragment() {
    return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren() {
    if (this.remaining === '') return {};
    this.consumeOptional('/');
    let t = [];
    for (
      this.peekStartsWith('(') || t.push(this.parseSegment());
      this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(');

    )
      (this.capture('/'), t.push(this.parseSegment()));
    let n = {};
    this.peekStartsWith('/(') && (this.capture('/'), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith('(') && (r = this.parseParens(!1)),
      (t.length > 0 || Object.keys(n).length > 0) && (r[z] = new ee(t, n)),
      r
    );
  }
  parseSegment() {
    let t = Hu(this.remaining);
    if (t === '' && this.peekStartsWith(';')) throw new b(4009, !1);
    return (this.capture(t), new Ln(_l(t), this.parseMatrixParams()));
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(';'); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = G3(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = '';
    if (this.consumeOptional('=')) {
      let o = Hu(this.remaining);
      o && ((r = o), this.capture(r));
    }
    t[_l(n)] = _l(r);
  }
  parseQueryParam(t) {
    let n = W3(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = '';
    if (this.consumeOptional('=')) {
      let s = Y3(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = _f(n),
      i = _f(r);
    if (t.hasOwnProperty(o)) {
      let s = t[o];
      (Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i));
    } else t[o] = i;
  }
  parseParens(t) {
    let n = {};
    for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
      let r = Hu(this.remaining),
        o = this.remaining[r.length];
      if (o !== '/' && o !== ')' && o !== ';') throw new b(4010, !1);
      let i;
      r.indexOf(':') > -1
        ? ((i = r.slice(0, r.indexOf(':'))), this.capture(i), this.capture(':'))
        : t && (i = z);
      let s = this.parseChildren();
      ((n[i] = Object.keys(s).length === 1 ? s[z] : new ee([], s)), this.consumeOptional('//'));
    }
    return n;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new b(4011, !1);
  }
};
function jf(e) {
  return e.segments.length > 0 ? new ee([], { [z]: e }) : e;
}
function Bf(e) {
  let t = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = Bf(o);
    if (r === z && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) t[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
  }
  let n = new ee(e.segments, t);
  return K3(n);
}
function K3(e) {
  if (e.numberOfChildren === 1 && e.children[z]) {
    let t = e.children[z];
    return new ee(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function _o(e) {
  return e instanceof Kt;
}
function Lf(e, t, n = null, r = null) {
  let o = Ff(e);
  return Vf(o, t, n, r);
}
function Ff(e) {
  let t;
  function n(i) {
    let s = {};
    for (let l of i.children) {
      let c = n(l);
      s[l.outlet] = c;
    }
    let a = new ee(i.url, s);
    return (i === e && (t = a), a);
  }
  let r = n(e.root),
    o = jf(r);
  return t ?? o;
}
function Vf(e, t, n, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return Uu(o, o, o, n, r);
  let i = Q3(t);
  if (i.toRoot()) return Uu(o, o, new ee([], {}), n, r);
  let s = X3(i, o, e),
    a = s.processChildren
      ? Bi(s.segmentGroup, s.index, i.commands)
      : Uf(s.segmentGroup, s.index, i.commands);
  return Uu(o, s.segmentGroup, a, n, r);
}
function xl(e) {
  return typeof e == 'object' && e != null && !e.outlets && !e.segmentPath;
}
function Vi(e) {
  return typeof e == 'object' && e != null && e.outlets;
}
function Uu(e, t, n, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([l, c]) => {
      i[l] = Array.isArray(c) ? c.map((d) => `${d}`) : `${c}`;
    });
  let s;
  e === t ? (s = n) : (s = Hf(e, t, n));
  let a = jf(Bf(s));
  return new Kt(a, i, o);
}
function Hf(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = Hf(i, t, n));
    }),
    new ee(e.segments, r)
  );
}
var Ml = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && xl(r[0]))
    )
      throw new b(4003, !1);
    let o = r.find(Vi);
    if (o && o !== If(r)) throw new b(4004, !1);
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
  }
};
function Q3(e) {
  if (typeof e[0] == 'string' && e.length === 1 && e[0] === '/') return new Ml(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == 'object' && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([l, c]) => {
              a[l] = typeof c == 'string' ? c.split('/') : c;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != 'string'
        ? [...o, i]
        : s === 0
          ? (i.split('/').forEach((a, l) => {
              (l == 0 && a === '.') ||
                (l == 0 && a === '' ? (n = !0) : a === '..' ? t++ : a != '' && o.push(a));
            }),
            o)
          : [...o, i];
    }, []);
  return new Ml(n, t, r);
}
var ko = class {
  segmentGroup;
  processChildren;
  index;
  constructor(t, n, r) {
    ((this.segmentGroup = t), (this.processChildren = n), (this.index = r));
  }
};
function X3(e, t, n) {
  if (e.isAbsolute) return new ko(t, !0, 0);
  if (!n) return new ko(t, !1, NaN);
  if (n.parent === null) return new ko(n, !0, 0);
  let r = xl(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r;
  return J3(n, o, e.numberOfDoubleDots);
}
function J3(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new b(4005, !1);
    o = r.segments.length;
  }
  return new ko(r, !1, o - i);
}
function eM(e) {
  return Vi(e[0]) ? e[0].outlets : { [z]: e };
}
function Uf(e, t, n) {
  if (((e ??= new ee([], {})), e.segments.length === 0 && e.hasChildren())) return Bi(e, t, n);
  let r = tM(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new ee(e.segments.slice(0, r.pathIndex), {});
    return ((i.children[z] = new ee(e.segments.slice(r.pathIndex), e.children)), Bi(i, 0, o));
  } else
    return r.match && o.length === 0
      ? new ee(e.segments, {})
      : r.match && !e.hasChildren()
        ? Yu(e, t, n)
        : r.match
          ? Bi(e, 0, o)
          : Yu(e, t, n);
}
function Bi(e, t, n) {
  if (n.length === 0) return new ee(e.segments, {});
  {
    let r = eM(n),
      o = {};
    if (
      Object.keys(r).some((i) => i !== z) &&
      e.children[z] &&
      e.numberOfChildren === 1 &&
      e.children[z].segments.length === 0
    ) {
      let i = Bi(e.children[z], t, n);
      return new ee(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        (typeof s == 'string' && (s = [s]), s !== null && (o[i] = Uf(e.children[i], t, s)));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new ee(e.segments, o)
    );
  }
}
function tM(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      a = n[r];
    if (Vi(a)) break;
    let l = `${a}`,
      c = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && l === void 0) break;
    if (l && c && typeof c == 'object' && c.outlets === void 0) {
      if (!Mf(l, c, s)) return i;
      r += 2;
    } else {
      if (!Mf(l, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function Yu(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (Vi(i)) {
      let l = nM(i.outlets);
      return new ee(r, l);
    }
    if (o === 0 && xl(n[0])) {
      let l = e.segments[t];
      (r.push(new Ln(l.path, xf(n[0]))), o++);
      continue;
    }
    let s = Vi(i) ? i.outlets[z] : `${i}`,
      a = o < n.length - 1 ? n[o + 1] : null;
    s && a && xl(a) ? (r.push(new Ln(s, xf(a))), (o += 2)) : (r.push(new Ln(s, {})), o++);
  }
  return new ee(r, {});
}
function nM(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      (typeof r == 'string' && (r = [r]), r !== null && (t[n] = Yu(new ee([], {}), 0, r)));
    }),
    t
  );
}
function xf(e) {
  let t = {};
  return (Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t);
}
function Mf(e, t, n) {
  return e == n.path && Zt(t, n.parameters);
}
var Li = 'imperative',
  De = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = 'NavigationStart'),
      (e[(e.NavigationEnd = 1)] = 'NavigationEnd'),
      (e[(e.NavigationCancel = 2)] = 'NavigationCancel'),
      (e[(e.NavigationError = 3)] = 'NavigationError'),
      (e[(e.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (e[(e.ResolveStart = 5)] = 'ResolveStart'),
      (e[(e.ResolveEnd = 6)] = 'ResolveEnd'),
      (e[(e.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (e[(e.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (e[(e.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (e[(e.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (e[(e.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (e[(e.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (e[(e.ActivationStart = 13)] = 'ActivationStart'),
      (e[(e.ActivationEnd = 14)] = 'ActivationEnd'),
      (e[(e.Scroll = 15)] = 'Scroll'),
      (e[(e.NavigationSkipped = 16)] = 'NavigationSkipped'),
      e
    );
  })(De || {}),
  nt = class {
    id;
    url;
    constructor(t, n) {
      ((this.id = t), (this.url = n));
    }
  },
  Dr = class extends nt {
    type = De.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(t, n, r = 'imperative', o = null) {
      (super(t, n), (this.navigationTrigger = r), (this.restoredState = o));
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  hn = class extends nt {
    urlAfterRedirects;
    type = De.NavigationEnd;
    constructor(t, n, r) {
      (super(t, n), (this.urlAfterRedirects = r));
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  He = (function (e) {
    return (
      (e[(e.Redirect = 0)] = 'Redirect'),
      (e[(e.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (e[(e.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (e[(e.GuardRejected = 3)] = 'GuardRejected'),
      (e[(e.Aborted = 4)] = 'Aborted'),
      e
    );
  })(He || {}),
  Hi = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] = 'IgnoredByUrlHandlingStrategy'),
      e
    );
  })(Hi || {}),
  Yt = class extends nt {
    reason;
    code;
    type = De.NavigationCancel;
    constructor(t, n, r, o) {
      (super(t, n), (this.reason = r), (this.code = o));
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  un = class extends nt {
    reason;
    code;
    type = De.NavigationSkipped;
    constructor(t, n, r, o) {
      (super(t, n), (this.reason = r), (this.code = o));
    }
  },
  xo = class extends nt {
    error;
    target;
    type = De.NavigationError;
    constructor(t, n, r, o) {
      (super(t, n), (this.error = r), (this.target = o));
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ui = class extends nt {
    urlAfterRedirects;
    state;
    type = De.RoutesRecognized;
    constructor(t, n, r, o) {
      (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Cl = class extends nt {
    urlAfterRedirects;
    state;
    type = De.GuardsCheckStart;
    constructor(t, n, r, o) {
      (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Dl = class extends nt {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = De.GuardsCheckEnd;
    constructor(t, n, r, o, i) {
      (super(t, n), (this.urlAfterRedirects = r), (this.state = o), (this.shouldActivate = i));
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  bl = class extends nt {
    urlAfterRedirects;
    state;
    type = De.ResolveStart;
    constructor(t, n, r, o) {
      (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  El = class extends nt {
    urlAfterRedirects;
    state;
    type = De.ResolveEnd;
    constructor(t, n, r, o) {
      (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Sl = class {
    route;
    type = De.RouteConfigLoadStart;
    constructor(t) {
      this.route = t;
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Il = class {
    route;
    type = De.RouteConfigLoadEnd;
    constructor(t) {
      this.route = t;
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Tl = class {
    snapshot;
    type = De.ChildActivationStart;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Al = class {
    snapshot;
    type = De.ChildActivationEnd;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Rl = class {
    snapshot;
    type = De.ActivationStart;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Pl = class {
    snapshot;
    type = De.ActivationEnd;
    constructor(t) {
      this.snapshot = t;
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  };
var zi = class {},
  Mo = class {
    url;
    navigationBehaviorOptions;
    constructor(t, n) {
      ((this.url = t), (this.navigationBehaviorOptions = n));
    }
  };
function rM(e) {
  return !(e instanceof zi) && !(e instanceof Mo);
}
function oM(e, t) {
  return (
    e.providers && !e._injector && (e._injector = Ci(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function At(e) {
  return e.outlet || z;
}
function iM(e, t) {
  let n = e.filter((r) => At(r) === t);
  return (n.push(...e.filter((r) => At(r) !== t)), n);
}
function bo(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var Ol = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return bo(this.route?.snapshot) ?? this.rootInjector;
    }
    constructor(t) {
      ((this.rootInjector = t), (this.children = new Eo(this.rootInjector)));
    }
  },
  Eo = (() => {
    class e {
      rootInjector;
      contexts = new Map();
      constructor(n) {
        this.rootInjector = n;
      }
      onChildOutletCreated(n, r) {
        let o = this.getOrCreateContext(n);
        ((o.outlet = r), this.contexts.set(n, o));
      }
      onChildOutletDestroyed(n) {
        let r = this.getContext(n);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return ((this.contexts = new Map()), n);
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let r = this.getContext(n);
        return (r || ((r = new Ol(this.rootInjector)), this.contexts.set(n, r)), r);
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
      static ɵfac = function (r) {
        return new (r || e)(O(ke));
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  Nl = class {
    _root;
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let n = this.pathFromRoot(t);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(t) {
      let n = Ku(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = Ku(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = Qu(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return Qu(t, this._root).map((n) => n.value);
    }
  };
function Ku(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = Ku(e, n);
    if (r) return r;
  }
  return null;
}
function Qu(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = Qu(e, n);
    if (r.length) return (r.unshift(t), r);
  }
  return [];
}
var tt = class {
  value;
  children;
  constructor(t, n) {
    ((this.value = t), (this.children = n));
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function mo(e) {
  let t = {};
  return (e && e.children.forEach((n) => (t[n.value.outlet] = n)), t);
}
var $i = class extends Nl {
  snapshot;
  constructor(t, n) {
    (super(t), (this.snapshot = n), ip(this, t));
  }
  toString() {
    return this.snapshot.toString();
  }
};
function zf(e) {
  let t = sM(e),
    n = new we([new Ln('', {})]),
    r = new we({}),
    o = new we({}),
    i = new we({}),
    s = new we(''),
    a = new Fn(n, r, i, s, o, z, e, t.root);
  return ((a.snapshot = t.root), new $i(new tt(a, []), t));
}
function sM(e) {
  let t = {},
    n = {},
    r = {},
    i = new xr([], t, r, '', n, z, e, null, {});
  return new Gi('', new tt(i, []));
}
var Fn = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(t, n, r, o, i, s, a, l) {
    ((this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = l),
      (this.title = this.dataSubject?.pipe(G((c) => c[Yi])) ?? j(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i));
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return ((this._paramMap ??= this.params.pipe(G((t) => Mr(t)))), this._paramMap);
  }
  get queryParamMap() {
    return ((this._queryParamMap ??= this.queryParams.pipe(G((t) => Mr(t)))), this._queryParamMap);
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
function jl(e, t, n = 'emptyOnly') {
  let r,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (n === 'always' || o?.path === '' || (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: w(w({}, t.params), e.params),
          data: w(w({}, t.data), e.data),
          resolve: w(w(w(w({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: w({}, e.params),
          data: w({}, e.data),
          resolve: w(w({}, e.data), e._resolvedData ?? {}),
        }),
    o && Gf(o) && (r.resolve[Yi] = o.title),
    r
  );
}
var xr = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    get title() {
      return this.data?.[Yi];
    }
    constructor(t, n, r, o, i, s, a, l, c) {
      ((this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = l),
        (this._resolve = c));
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return ((this._paramMap ??= Mr(this.params)), this._paramMap);
    }
    get queryParamMap() {
      return ((this._queryParamMap ??= Mr(this.queryParams)), this._queryParamMap);
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join('/'),
        n = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${t}', path:'${n}')`;
    }
  },
  Gi = class extends Nl {
    url;
    constructor(t, n) {
      (super(n), (this.url = t), ip(this, n));
    }
    toString() {
      return $f(this._root);
    }
  };
function ip(e, t) {
  ((t.value._routerState = e), t.children.forEach((n) => ip(e, n)));
}
function $f(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map($f).join(', ')} } ` : '';
  return `${e.value}${t}`;
}
function zu(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    ((e.snapshot = n),
      Zt(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      Zt(t.params, n.params) || e.paramsSubject.next(n.params),
      P3(t.url, n.url) || e.urlSubject.next(n.url),
      Zt(t.data, n.data) || e.dataSubject.next(n.data));
  } else ((e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data));
}
function Xu(e, t) {
  let n = Zt(e.params, t.params) && B3(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || Xu(e.parent, t.parent));
}
function Gf(e) {
  return typeof e.title == 'string' || e.title === null;
}
var qf = new _(''),
  Qi = (() => {
    class e {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = z;
      activateEvents = new T();
      deactivateEvents = new T();
      attachEvents = new T();
      detachEvents = new T();
      routerOutletData = Nn(void 0);
      parentContexts = u(Eo);
      location = u(gt);
      changeDetector = u(wt);
      inputBinder = u(Vl, { optional: !0 });
      supportsBindingToComponentInputs = !0;
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: r, previousValue: o } = n.name;
          if (r) return;
          (this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName());
        }
      }
      ngOnDestroy() {
        (this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this));
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new b(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new b(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new b(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, r) {
        ((this.activated = n),
          (this._activatedRoute = r),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance));
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          (this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n));
        }
      }
      activateWith(n, r) {
        if (this.isActivated) throw new b(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          s = n.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          l = new Ju(n, a, o.injector, this.routerOutletData);
        ((this.activated = o.createComponent(s, {
          index: o.length,
          injector: l,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = oe({
        type: e,
        selectors: [['router-outlet']],
        inputs: { name: 'name', routerOutletData: [1, 'routerOutletData'] },
        outputs: {
          activateEvents: 'activate',
          deactivateEvents: 'deactivate',
          attachEvents: 'attach',
          detachEvents: 'detach',
        },
        exportAs: ['outlet'],
        features: [Et],
      });
    }
    return e;
  })(),
  Ju = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(t, n, r, o) {
      ((this.route = t), (this.childContexts = n), (this.parent = r), (this.outletData = o));
    }
    get(t, n) {
      return t === Fn
        ? this.route
        : t === Eo
          ? this.childContexts
          : t === qf
            ? this.outletData
            : this.parent.get(t, n);
    }
  },
  Vl = new _('');
var sp = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵcmp = se({
      type: e,
      selectors: [['ng-component']],
      exportAs: ['emptyRouterOutlet'],
      decls: 1,
      vars: 0,
      template: function (r, o) {
        r & 1 && E(0, 'router-outlet');
      },
      dependencies: [Qi],
      encapsulation: 2,
    });
  }
  return e;
})();
function ap(e) {
  let t = e.children && e.children.map(ap),
    n = t ? F(w({}, e), { children: t }) : w({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== z &&
      (n.component = sp),
    n
  );
}
function aM(e, t, n) {
  let r = qi(e, t._root, n ? n._root : void 0);
  return new $i(r, t);
}
function qi(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let o = lM(e, t, n);
    return new tt(r, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => qi(e, a))),
          s
        );
      }
    }
    let r = cM(t.value),
      o = t.children.map((i) => qi(e, i));
    return new tt(r, o);
  }
}
function lM(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children) if (e.shouldReuseRoute(r.value, o.value.snapshot)) return qi(e, r, o);
    return qi(e, r);
  });
}
function cM(e) {
  return new Fn(
    new we(e.url),
    new we(e.params),
    new we(e.queryParams),
    new we(e.fragment),
    new we(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Co = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(t, n) {
      ((this.redirectTo = t), (this.navigationBehaviorOptions = n));
    }
  },
  Wf = 'ngNavigationCancelingError';
function Bl(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = _o(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = Zf(!1, He.Redirect);
  return ((o.url = n), (o.navigationBehaviorOptions = r), o);
}
function Zf(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ''}`);
  return ((n[Wf] = !0), (n.cancellationCode = t), n);
}
function dM(e) {
  return Yf(e) && _o(e.url);
}
function Yf(e) {
  return !!e && e[Wf];
}
var hM = (e, t, n, r) =>
    G((o) => (new ep(t, o.targetRouterState, o.currentRouterState, n, r).activate(e), o)),
  ep = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(t, n, r, o, i) {
      ((this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i));
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      (this.deactivateChildRoutes(n, r, t),
        zu(this.futureState.root),
        this.activateChildRoutes(n, r, t));
    }
    deactivateChildRoutes(t, n, r) {
      let o = mo(n);
      (t.children.forEach((i) => {
        let s = i.value.outlet;
        (this.deactivateRoutes(i, o[s], r), delete o[s]);
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        }));
    }
    deactivateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(t, n, s.children);
        } else this.deactivateChildRoutes(t, n, r);
      else i && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n);
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = mo(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, { componentRef: s, route: t, contexts: a });
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = mo(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(t, n, r) {
      let o = mo(n);
      (t.children.forEach((i) => {
        (this.activateRoutes(i, o[i.value.outlet], r), this.forwardEvent(new Pl(i.value.snapshot)));
      }),
        t.children.length && this.forwardEvent(new Al(t.value.snapshot)));
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if ((zu(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(t, n, s.children);
        } else this.activateChildRoutes(t, n, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          (this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            zu(a.route.value),
            this.activateChildRoutes(t, null, s.children));
        } else
          ((s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children));
      } else this.activateChildRoutes(t, null, r);
    }
  },
  Ll = class {
    path;
    route;
    constructor(t) {
      ((this.path = t), (this.route = this.path[this.path.length - 1]));
    }
  },
  yo = class {
    component;
    route;
    constructor(t, n) {
      ((this.component = t), (this.route = n));
    }
  };
function uM(e, t, n) {
  let r = e._root,
    o = t ? t._root : null;
  return ji(r, o, n, [r.value]);
}
function pM(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function So(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == 'function' && !ld(e) ? e : t.get(e)) : r;
}
function ji(e, t, n, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let i = mo(t);
  return (
    e.children.forEach((s) => {
      (gM(s, i[s.value.outlet], n, r.concat([s.value]), o), delete i[s.value.outlet]);
    }),
    Object.entries(i).forEach(([s, a]) => Fi(a, n.getContext(s), o)),
    o
  );
}
function gM(e, t, n, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let i = e.value,
    s = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let l = fM(s, i, i.routeConfig.runGuardsAndResolvers);
    (l
      ? o.canActivateChecks.push(new Ll(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? ji(e, t, a ? a.children : null, r, o) : ji(e, t, n, r, o),
      l &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new yo(a.outlet.component, s)));
  } else
    (s && Fi(t, a, o),
      o.canActivateChecks.push(new Ll(r)),
      i.component ? ji(e, null, a ? a.children : null, r, o) : ji(e, null, n, r, o));
  return o;
}
function fM(e, t, n) {
  if (typeof n == 'function') return n(e, t);
  switch (n) {
    case 'pathParamsChange':
      return !_r(e.url, t.url);
    case 'pathParamsOrQueryParamsChange':
      return !_r(e.url, t.url) || !Zt(e.queryParams, t.queryParams);
    case 'always':
      return !0;
    case 'paramsOrQueryParamsChange':
      return !Xu(e, t) || !Zt(e.queryParams, t.queryParams);
    case 'paramsChange':
    default:
      return !Xu(e, t);
  }
}
function Fi(e, t, n) {
  let r = mo(e),
    o = e.value;
  (Object.entries(r).forEach(([i, s]) => {
    o.component ? (t ? Fi(s, t.children.getContext(i), n) : Fi(s, null, n)) : Fi(s, t, n);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new yo(t.outlet.component, o))
        : n.canDeactivateChecks.push(new yo(null, o))
      : n.canDeactivateChecks.push(new yo(null, o)));
}
function Xi(e) {
  return typeof e == 'function';
}
function vM(e) {
  return typeof e == 'boolean';
}
function wM(e) {
  return e && Xi(e.canLoad);
}
function mM(e) {
  return e && Xi(e.canActivate);
}
function kM(e) {
  return e && Xi(e.canActivateChild);
}
function yM(e) {
  return e && Xi(e.canDeactivate);
}
function _M(e) {
  return e && Xi(e.canMatch);
}
function Kf(e) {
  return e instanceof Qt || e?.name === 'EmptyError';
}
var ml = Symbol('INITIAL_VALUE');
function Do() {
  return be((e) =>
    na(e.map((t) => t.pipe(_t(1), Zn(ml)))).pipe(
      G((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === ml) return ml;
            if (n === !1 || xM(n)) return n;
          }
        return !0;
      }),
      $e((t) => t !== ml),
      _t(1),
    ),
  );
}
function xM(e) {
  return _o(e) || e instanceof Co;
}
function MM(e, t) {
  return me((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && i.length === 0
      ? j(F(w({}, n), { guardsResult: !0 }))
      : CM(s, r, o, e).pipe(
          me((a) => (a && vM(a) ? DM(r, i, e, t) : j(a))),
          G((a) => F(w({}, n), { guardsResult: a })),
        );
  });
}
function CM(e, t, n, r) {
  return ce(e).pipe(
    me((o) => TM(o.component, o.route, n, t, r)),
    Xt((o) => o !== !0, !0),
  );
}
function DM(e, t, n, r) {
  return ce(t).pipe(
    qr((o) => Gr(EM(o.route.parent, r), bM(o.route, r), IM(e, o.path, n), SM(e, o.route, n))),
    Xt((o) => o !== !0, !0),
  );
}
function bM(e, t) {
  return (e !== null && t && t(new Rl(e)), j(!0));
}
function EM(e, t) {
  return (e !== null && t && t(new Tl(e)), j(!0));
}
function SM(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return j(!0);
  let o = r.map((i) =>
    qo(() => {
      let s = bo(t) ?? n,
        a = So(i, s),
        l = mM(a) ? a.canActivate(t, e) : Se(s, () => a(t, e));
      return pn(l).pipe(Xt());
    }),
  );
  return j(o).pipe(Do());
}
function IM(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => pM(s))
      .filter((s) => s !== null)
      .map((s) =>
        qo(() => {
          let a = s.guards.map((l) => {
            let c = bo(s.node) ?? n,
              d = So(l, c),
              h = kM(d) ? d.canActivateChild(r, e) : Se(c, () => d(r, e));
            return pn(h).pipe(Xt());
          });
          return j(a).pipe(Do());
        }),
      );
  return j(i).pipe(Do());
}
function TM(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return j(!0);
  let s = i.map((a) => {
    let l = bo(t) ?? o,
      c = So(a, l),
      d = yM(c) ? c.canDeactivate(e, t, n, r) : Se(l, () => c(e, t, n, r));
    return pn(d).pipe(Xt());
  });
  return j(s).pipe(Do());
}
function AM(e, t, n, r) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return j(!0);
  let i = o.map((s) => {
    let a = So(s, e),
      l = wM(a) ? a.canLoad(t, n) : Se(e, () => a(t, n));
    return pn(l);
  });
  return j(i).pipe(Do(), Qf(r));
}
function Qf(e) {
  return jc(
    fe((t) => {
      if (typeof t != 'boolean') throw Bl(e, t);
    }),
    G((t) => t === !0),
  );
}
function RM(e, t, n, r) {
  let o = t.canMatch;
  if (!o || o.length === 0) return j(!0);
  let i = o.map((s) => {
    let a = So(s, e),
      l = _M(a) ? a.canMatch(t, n) : Se(e, () => a(t, n));
    return pn(l);
  });
  return j(i).pipe(Do(), Qf(r));
}
var Wi = class {
    segmentGroup;
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  Zi = class extends Error {
    urlTree;
    constructor(t) {
      (super(), (this.urlTree = t));
    }
  };
function wo(e) {
  return zr(new Wi(e));
}
function PM(e) {
  return zr(new b(4e3, !1));
}
function OM(e) {
  return zr(Zf(!1, He.GuardRejected));
}
var tp = class {
  urlSerializer;
  urlTree;
  constructor(t, n) {
    ((this.urlSerializer = t), (this.urlTree = n));
  }
  lineralizeSegments(t, n) {
    let r = [],
      o = n.root;
    for (;;) {
      if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return j(r);
      if (o.numberOfChildren > 1 || !o.children[z]) return PM(`${t.redirectTo}`);
      o = o.children[z];
    }
  }
  applyRedirectCommands(t, n, r, o, i) {
    return NM(n, o, i).pipe(
      G((s) => {
        if (s instanceof Kt) throw new Zi(s);
        let a = this.applyRedirectCreateUrlTree(s, this.urlSerializer.parse(s), t, r);
        if (s[0] === '/') throw new Zi(a);
        return a;
      }),
    );
  }
  applyRedirectCreateUrlTree(t, n, r, o) {
    let i = this.createSegmentGroup(t, n.root, r, o);
    return new Kt(i, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment);
  }
  createQueryParams(t, n) {
    let r = {};
    return (
      Object.entries(t).forEach(([o, i]) => {
        if (typeof i == 'string' && i[0] === ':') {
          let a = i.substring(1);
          r[o] = n[a];
        } else r[o] = i;
      }),
      r
    );
  }
  createSegmentGroup(t, n, r, o) {
    let i = this.createSegments(t, n.segments, r, o),
      s = {};
    return (
      Object.entries(n.children).forEach(([a, l]) => {
        s[a] = this.createSegmentGroup(t, l, r, o);
      }),
      new ee(i, s)
    );
  }
  createSegments(t, n, r, o) {
    return n.map((i) => (i.path[0] === ':' ? this.findPosParam(t, i, o) : this.findOrReturn(i, r)));
  }
  findPosParam(t, n, r) {
    let o = r[n.path.substring(1)];
    if (!o) throw new b(4001, !1);
    return o;
  }
  findOrReturn(t, n) {
    let r = 0;
    for (let o of n) {
      if (o.path === t.path) return (n.splice(r), o);
      r++;
    }
    return t;
  }
};
function NM(e, t, n) {
  if (typeof e == 'string') return j(e);
  let r = e,
    {
      queryParams: o,
      fragment: i,
      routeConfig: s,
      url: a,
      outlet: l,
      params: c,
      data: d,
      title: h,
    } = t;
  return pn(
    Se(n, () =>
      r({
        params: c,
        data: d,
        queryParams: o,
        fragment: i,
        routeConfig: s,
        url: a,
        outlet: l,
        title: h,
      }),
    ),
  );
}
var np = {
  matched: !1,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function jM(e, t, n, r, o) {
  let i = Xf(e, t, n);
  return i.matched
    ? ((r = oM(t, r)), RM(r, t, n, o).pipe(G((s) => (s === !0 ? i : w({}, np)))))
    : j(i);
}
function Xf(e, t, n) {
  if (t.path === '**') return BM(n);
  if (t.path === '')
    return t.pathMatch === 'full' && (e.hasChildren() || n.length > 0)
      ? w({}, np)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || Ef)(n, e, t);
  if (!o) return w({}, np);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, l]) => {
    i[a] = l.path;
  });
  let s = o.consumed.length > 0 ? w(w({}, i), o.consumed[o.consumed.length - 1].parameters) : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function BM(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? If(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Cf(e, t, n, r) {
  return n.length > 0 && VM(e, n, r)
    ? { segmentGroup: new ee(t, FM(r, new ee(n, e.children))), slicedSegments: [] }
    : n.length === 0 && HM(e, n, r)
      ? { segmentGroup: new ee(e.segments, LM(e, n, r, e.children)), slicedSegments: n }
      : { segmentGroup: new ee(e.segments, e.children), slicedSegments: n };
}
function LM(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (Hl(e, t, i) && !r[At(i)]) {
      let s = new ee([], {});
      o[At(i)] = s;
    }
  return w(w({}, r), o);
}
function FM(e, t) {
  let n = {};
  n[z] = t;
  for (let r of e)
    if (r.path === '' && At(r) !== z) {
      let o = new ee([], {});
      n[At(r)] = o;
    }
  return n;
}
function VM(e, t, n) {
  return n.some((r) => Hl(e, t, r) && At(r) !== z);
}
function HM(e, t, n) {
  return n.some((r) => Hl(e, t, r));
}
function Hl(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === 'full' ? !1 : n.path === '';
}
function UM(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var rp = class {};
function zM(e, t, n, r, o, i, s = 'emptyOnly') {
  return new op(e, t, n, r, o, s, i).recognize();
}
var $M = 31,
  op = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = !0;
    constructor(t, n, r, o, i, s, a) {
      ((this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new tp(this.urlSerializer, this.urlTree)));
    }
    noMatchError(t) {
      return new b(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = Cf(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        G(({ children: n, rootSnapshot: r }) => {
          let o = new tt(r, n),
            i = new Gi('', o),
            s = Lf(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            { state: i, tree: s }
          );
        }),
      );
    }
    match(t) {
      let n = new xr(
        [],
        Object.freeze({}),
        Object.freeze(w({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        z,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, t, z, n).pipe(
        G((r) => ({ children: r, rootSnapshot: n })),
        wn((r) => {
          if (r instanceof Zi) return ((this.urlTree = r.urlTree), this.match(r.urlTree.root));
          throw r instanceof Wi ? this.noMatchError(r) : r;
        }),
      );
    }
    processSegmentGroup(t, n, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r, i)
        : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(
            G((s) => (s instanceof tt ? [s] : [])),
          );
    }
    processChildren(t, n, r, o) {
      let i = [];
      for (let s of Object.keys(r.children)) s === 'primary' ? i.unshift(s) : i.push(s);
      return ce(i).pipe(
        qr((s) => {
          let a = r.children[s],
            l = iM(n, s);
          return this.processSegmentGroup(t, l, a, s, o);
        }),
        Gc((s, a) => (s.push(...a), s)),
        mn(null),
        $c(),
        me((s) => {
          if (s === null) return wo(r);
          let a = Jf(s);
          return (GM(a), j(a));
        }),
      );
    }
    processSegment(t, n, r, o, i, s, a) {
      return ce(n).pipe(
        qr((l) =>
          this.processSegmentAgainstRoute(l._injector ?? t, n, l, r, o, i, s, a).pipe(
            wn((c) => {
              if (c instanceof Wi) return j(null);
              throw c;
            }),
          ),
        ),
        Xt((l) => !!l),
        wn((l) => {
          if (Kf(l)) return UM(r, o, i) ? j(new rp()) : wo(r);
          throw l;
        }),
      );
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, a, l) {
      return At(r) !== s && (s === z || !Hl(o, i, r))
        ? wo(o)
        : r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, o, r, i, s, l)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, l)
            : wo(o);
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
      let {
        matched: l,
        parameters: c,
        consumedSegments: d,
        positionalParamSegments: h,
        remainingSegments: g,
      } = Xf(n, o, i);
      if (!l) return wo(n);
      typeof o.redirectTo == 'string' &&
        o.redirectTo[0] === '/' &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > $M && (this.allowRedirects = !1));
      let p = new xr(
          i,
          c,
          Object.freeze(w({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Df(o),
          At(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          bf(o),
        ),
        x = jl(p, a, this.paramsInheritanceStrategy);
      return (
        (p.params = Object.freeze(x.params)),
        (p.data = Object.freeze(x.data)),
        this.applyRedirects.applyRedirectCommands(d, o.redirectTo, h, p, t).pipe(
          be((L) => this.applyRedirects.lineralizeSegments(o, L)),
          me((L) => this.processSegment(t, r, n, L.concat(g), s, !1, a)),
        )
      );
    }
    matchSegmentAgainstRoute(t, n, r, o, i, s) {
      let a = jM(n, r, o, t, this.urlSerializer);
      return (
        r.path === '**' && (n.children = {}),
        a.pipe(
          be((l) =>
            l.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, o).pipe(
                  be(({ routes: c }) => {
                    let d = r._loadedInjector ?? t,
                      { parameters: h, consumedSegments: g, remainingSegments: p } = l,
                      x = new xr(
                        g,
                        h,
                        Object.freeze(w({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Df(r),
                        At(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        bf(r),
                      ),
                      R = jl(x, s, this.paramsInheritanceStrategy);
                    ((x.params = Object.freeze(R.params)), (x.data = Object.freeze(R.data)));
                    let { segmentGroup: L, slicedSegments: Z } = Cf(n, g, p, c);
                    if (Z.length === 0 && L.hasChildren())
                      return this.processChildren(d, c, L, x).pipe(G((gn) => new tt(x, gn)));
                    if (c.length === 0 && Z.length === 0) return j(new tt(x, []));
                    let ms = At(r) === i;
                    return this.processSegment(d, c, L, Z, ms ? z : i, !0, x).pipe(
                      G((gn) => new tt(x, gn instanceof tt ? [gn] : [])),
                    );
                  }),
                ))
              : wo(n),
          ),
        )
      );
    }
    getChildConfig(t, n, r) {
      return n.children
        ? j({ routes: n.children, injector: t })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? j({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : AM(t, n, r, this.urlSerializer).pipe(
                me((o) =>
                  o
                    ? this.configLoader.loadChildren(t, n).pipe(
                        fe((i) => {
                          ((n._loadedRoutes = i.routes), (n._loadedInjector = i.injector));
                        }),
                      )
                    : OM(n),
                ),
              )
          : j({ routes: [], injector: t });
    }
  };
function GM(e) {
  e.sort((t, n) =>
    t.value.outlet === z
      ? -1
      : n.value.outlet === z
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function qM(e) {
  let t = e.value.routeConfig;
  return t && t.path === '';
}
function Jf(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!qM(r)) {
      t.push(r);
      continue;
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
  }
  for (let r of n) {
    let o = Jf(r.children);
    t.push(new tt(r.value, o));
  }
  return t.filter((r) => !n.has(r));
}
function Df(e) {
  return e.data || {};
}
function bf(e) {
  return e.resolve || {};
}
function WM(e, t, n, r, o, i) {
  return me((s) =>
    zM(e, t, n, r, s.extractedUrl, o, i).pipe(
      G(({ state: a, tree: l }) => F(w({}, s), { targetSnapshot: a, urlAfterRedirects: l })),
    ),
  );
}
function ZM(e, t) {
  return me((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n;
    if (!o.length) return j(n);
    let i = new Set(o.map((l) => l.route)),
      s = new Set();
    for (let l of i) if (!s.has(l)) for (let c of ev(l)) s.add(c);
    let a = 0;
    return ce(s).pipe(
      qr((l) => (i.has(l) ? YM(l, r, e, t) : ((l.data = jl(l, l.parent, e).resolve), j(void 0)))),
      fe(() => a++),
      Wr(1),
      me((l) => (a === s.size ? j(n) : Re)),
    );
  });
}
function ev(e) {
  let t = e.children.map((n) => ev(n)).flat();
  return [e, ...t];
}
function YM(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !Gf(o) && (i[Yi] = o.title),
    qo(
      () => (
        (e.data = jl(e, e.parent, n).resolve),
        KM(i, e, t, r).pipe(G((s) => ((e._resolvedData = s), (e.data = w(w({}, e.data), s)), null)))
      ),
    )
  );
}
function KM(e, t, n, r) {
  let o = qu(e);
  if (o.length === 0) return j({});
  let i = {};
  return ce(o).pipe(
    me((s) =>
      QM(e[s], t, n, r).pipe(
        Xt(),
        fe((a) => {
          if (a instanceof Co) throw Bl(new Cr(), a);
          i[s] = a;
        }),
      ),
    ),
    Wr(1),
    G(() => i),
    wn((s) => (Kf(s) ? Re : zr(s))),
  );
}
function QM(e, t, n, r) {
  let o = bo(t) ?? r,
    i = So(e, o),
    s = i.resolve ? i.resolve(t, n) : Se(o, () => i(t, n));
  return pn(s);
}
function $u(e) {
  return be((t) => {
    let n = e(t);
    return n ? ce(n).pipe(G(() => t)) : j(t);
  });
}
var lp = (() => {
    class e {
      buildTitle(n) {
        let r,
          o = n.root;
        for (; o !== void 0; )
          ((r = this.getResolvedTitleForRoute(o) ?? r),
            (o = o.children.find((i) => i.outlet === z)));
        return r;
      }
      getResolvedTitleForRoute(n) {
        return n.data[Yi];
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: () => u(tv), providedIn: 'root' });
    }
    return e;
  })(),
  tv = (() => {
    class e extends lp {
      title;
      constructor(n) {
        (super(), (this.title = n));
      }
      updateTitle(n) {
        let r = this.buildTitle(n);
        r !== void 0 && this.title.setTitle(r);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(kf));
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  Ji = new _('', { providedIn: 'root', factory: () => ({}) }),
  es = new _(''),
  nv = (() => {
    class e {
      componentLoaders = new WeakMap();
      childrenLoaders = new WeakMap();
      onLoadStartListener;
      onLoadEndListener;
      compiler = u(vu);
      loadComponent(n, r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return j(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let o = pn(Se(n, () => r.loadComponent())).pipe(
            G(ov),
            be(iv),
            fe((s) => {
              (this.onLoadEndListener && this.onLoadEndListener(r), (r._loadedComponent = s));
            }),
            Zo(() => {
              this.componentLoaders.delete(r);
            }),
          ),
          i = new Lr(o, () => new P()).pipe(Br());
        return (this.componentLoaders.set(r, i), i);
      }
      loadChildren(n, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes) return j({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = rv(r, this.compiler, n, this.onLoadEndListener).pipe(
            Zo(() => {
              this.childrenLoaders.delete(r);
            }),
          ),
          s = new Lr(i, () => new P()).pipe(Br());
        return (this.childrenLoaders.set(r, s), s);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function rv(e, t, n, r) {
  return pn(Se(n, () => e.loadChildren())).pipe(
    G(ov),
    be(iv),
    me((o) => (o instanceof nl || Array.isArray(o) ? j(o) : ce(t.compileModuleAsync(o)))),
    G((o) => {
      r && r(e);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(n).injector), (s = i.get(es, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(ap), injector: i }
      );
    }),
  );
}
function XM(e) {
  return e && typeof e == 'object' && 'default' in e;
}
function ov(e) {
  return XM(e) ? e.default : e;
}
function iv(e) {
  return j(e);
}
var Ul = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: () => u(JM), providedIn: 'root' });
    }
    return e;
  })(),
  JM = (() => {
    class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, r) {
        return n;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  sv = new _('');
var av = new _(''),
  lv = (() => {
    class e {
      currentNavigation = W(null, { equal: () => !1 });
      currentTransition = null;
      lastSuccessfulNavigation = null;
      events = new P();
      transitionAbortWithErrorSubject = new P();
      configLoader = u(nv);
      environmentInjector = u(ke);
      destroyRef = u(ht);
      urlSerializer = u(Ki);
      rootContexts = u(Eo);
      location = u(vo);
      inputBindingEnabled = u(Vl, { optional: !0 }) !== null;
      titleStrategy = u(lp);
      options = u(Ji, { optional: !0 }) || {};
      paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || 'emptyOnly';
      urlHandlingStrategy = u(Ul);
      createViewTransition = u(sv, { optional: !0 });
      navigationErrorHandler = u(av, { optional: !0 });
      navigationId = 0;
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      transitions;
      afterPreactivation = () => j(void 0);
      rootComponentType = null;
      destroyed = !1;
      constructor() {
        let n = (o) => this.events.next(new Sl(o)),
          r = (o) => this.events.next(new Il(o));
        ((this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = n),
          this.destroyRef.onDestroy(() => {
            this.destroyed = !0;
          }));
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let r = ++this.navigationId;
        Ce(() => {
          this.transitions?.next(
            F(w({}, n), {
              extractedUrl: this.urlHandlingStrategy.extract(n.rawUrl),
              targetSnapshot: null,
              targetRouterState: null,
              guards: { canActivateChecks: [], canDeactivateChecks: [] },
              guardsResult: null,
              abortController: new AbortController(),
              id: r,
            }),
          );
        });
      }
      setupNavigations(n) {
        return (
          (this.transitions = new we(null)),
          this.transitions.pipe(
            $e((r) => r !== null),
            be((r) => {
              let o = !1;
              return j(r).pipe(
                be((i) => {
                  if (this.navigationId > r.id)
                    return (
                      this.cancelNavigationTransition(r, '', He.SupersededByNewNavigation),
                      Re
                    );
                  ((this.currentTransition = r),
                    this.currentNavigation.set({
                      id: i.id,
                      initialUrl: i.rawUrl,
                      extractedUrl: i.extractedUrl,
                      targetBrowserUrl:
                        typeof i.extras.browserUrl == 'string'
                          ? this.urlSerializer.parse(i.extras.browserUrl)
                          : i.extras.browserUrl,
                      trigger: i.source,
                      extras: i.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? F(w({}, this.lastSuccessfulNavigation), { previousNavigation: null })
                        : null,
                      abort: () => i.abortController.abort(),
                    }));
                  let s =
                      !n.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                    a = i.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!s && a !== 'reload')
                    return (
                      this.events.next(
                        new un(
                          i.id,
                          this.urlSerializer.serialize(i.rawUrl),
                          '',
                          Hi.IgnoredSameUrlNavigation,
                        ),
                      ),
                      i.resolve(!1),
                      Re
                    );
                  if (this.urlHandlingStrategy.shouldProcessUrl(i.rawUrl))
                    return j(i).pipe(
                      be(
                        (l) => (
                          this.events.next(
                            new Dr(
                              l.id,
                              this.urlSerializer.serialize(l.extractedUrl),
                              l.source,
                              l.restoredState,
                            ),
                          ),
                          l.id !== this.navigationId ? Re : Promise.resolve(l)
                        ),
                      ),
                      WM(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      fe((l) => {
                        ((r.targetSnapshot = l.targetSnapshot),
                          (r.urlAfterRedirects = l.urlAfterRedirects),
                          this.currentNavigation.update(
                            (d) => ((d.finalUrl = l.urlAfterRedirects), d),
                          ));
                        let c = new Ui(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(c);
                      }),
                    );
                  if (s && this.urlHandlingStrategy.shouldProcessUrl(i.currentRawUrl)) {
                    let { id: l, extractedUrl: c, source: d, restoredState: h, extras: g } = i,
                      p = new Dr(l, this.urlSerializer.serialize(c), d, h);
                    this.events.next(p);
                    let x = zf(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = r =
                        F(w({}, i), {
                          targetSnapshot: x,
                          urlAfterRedirects: c,
                          extras: F(w({}, g), { skipLocationChange: !1, replaceUrl: !1 }),
                        })),
                      this.currentNavigation.update((R) => ((R.finalUrl = c), R)),
                      j(r)
                    );
                  } else
                    return (
                      this.events.next(
                        new un(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          '',
                          Hi.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      i.resolve(!1),
                      Re
                    );
                }),
                fe((i) => {
                  let s = new Cl(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot,
                  );
                  this.events.next(s);
                }),
                G(
                  (i) => (
                    (this.currentTransition = r =
                      F(w({}, i), {
                        guards: uM(i.targetSnapshot, i.currentSnapshot, this.rootContexts),
                      })),
                    r
                  ),
                ),
                MM(this.environmentInjector, (i) => this.events.next(i)),
                fe((i) => {
                  if (
                    ((r.guardsResult = i.guardsResult),
                    i.guardsResult && typeof i.guardsResult != 'boolean')
                  )
                    throw Bl(this.urlSerializer, i.guardsResult);
                  let s = new Dl(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot,
                    !!i.guardsResult,
                  );
                  this.events.next(s);
                }),
                $e((i) =>
                  i.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(i, '', He.GuardRejected), !1),
                ),
                $u((i) => {
                  if (i.guards.canActivateChecks.length !== 0)
                    return j(i).pipe(
                      fe((s) => {
                        let a = new bl(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot,
                        );
                        this.events.next(a);
                      }),
                      be((s) => {
                        let a = !1;
                        return j(s).pipe(
                          ZM(this.paramsInheritanceStrategy, this.environmentInjector),
                          fe({
                            next: () => (a = !0),
                            complete: () => {
                              a || this.cancelNavigationTransition(s, '', He.NoDataFromResolver);
                            },
                          }),
                        );
                      }),
                      fe((s) => {
                        let a = new El(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot,
                        );
                        this.events.next(a);
                      }),
                    );
                }),
                $u((i) => {
                  let s = (a) => {
                    let l = [];
                    if (a.routeConfig?.loadComponent) {
                      let c = bo(a) ?? this.environmentInjector;
                      l.push(
                        this.configLoader.loadComponent(c, a.routeConfig).pipe(
                          fe((d) => {
                            a.component = d;
                          }),
                          G(() => {}),
                        ),
                      );
                    }
                    for (let c of a.children) l.push(...s(c));
                    return l;
                  };
                  return na(s(i.targetSnapshot.root)).pipe(mn(null), _t(1));
                }),
                $u(() => this.afterPreactivation()),
                be(() => {
                  let { currentSnapshot: i, targetSnapshot: s } = r,
                    a = this.createViewTransition?.(this.environmentInjector, i.root, s.root);
                  return a ? ce(a).pipe(G(() => r)) : j(r);
                }),
                G((i) => {
                  let s = aM(n.routeReuseStrategy, i.targetSnapshot, i.currentRouterState);
                  return (
                    (this.currentTransition = r = F(w({}, i), { targetRouterState: s })),
                    this.currentNavigation.update((a) => ((a.targetRouterState = s), a)),
                    r
                  );
                }),
                fe(() => {
                  this.events.next(new zi());
                }),
                hM(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (i) => this.events.next(i),
                  this.inputBindingEnabled,
                ),
                _t(1),
                Lt(
                  new U((i) => {
                    let s = r.abortController.signal,
                      a = () => i.next();
                    return (
                      s.addEventListener('abort', a),
                      () => s.removeEventListener('abort', a)
                    );
                  }).pipe(
                    $e(() => !o && !r.targetRouterState),
                    fe(() => {
                      this.cancelNavigationTransition(
                        r,
                        r.abortController.signal.reason + '',
                        He.Aborted,
                      );
                    }),
                  ),
                ),
                fe({
                  next: (i) => {
                    ((o = !0),
                      (this.lastSuccessfulNavigation = Ce(this.currentNavigation)),
                      this.events.next(
                        new hn(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          this.urlSerializer.serialize(i.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(i.targetRouterState.snapshot),
                      i.resolve(!0));
                  },
                  complete: () => {
                    o = !0;
                  },
                }),
                Lt(
                  this.transitionAbortWithErrorSubject.pipe(
                    fe((i) => {
                      throw i;
                    }),
                  ),
                ),
                Zo(() => {
                  (o || this.cancelNavigationTransition(r, '', He.SupersededByNewNavigation),
                    this.currentTransition?.id === r.id &&
                      (this.currentNavigation.set(null), (this.currentTransition = null)));
                }),
                wn((i) => {
                  if (this.destroyed) return (r.resolve(!1), Re);
                  if (((o = !0), Yf(i)))
                    (this.events.next(
                      new Yt(
                        r.id,
                        this.urlSerializer.serialize(r.extractedUrl),
                        i.message,
                        i.cancellationCode,
                      ),
                    ),
                      dM(i)
                        ? this.events.next(new Mo(i.url, i.navigationBehaviorOptions))
                        : r.resolve(!1));
                  else {
                    let s = new xo(
                      r.id,
                      this.urlSerializer.serialize(r.extractedUrl),
                      i,
                      r.targetSnapshot ?? void 0,
                    );
                    try {
                      let a = Se(this.environmentInjector, () => this.navigationErrorHandler?.(s));
                      if (a instanceof Co) {
                        let { message: l, cancellationCode: c } = Bl(this.urlSerializer, a);
                        (this.events.next(
                          new Yt(r.id, this.urlSerializer.serialize(r.extractedUrl), l, c),
                        ),
                          this.events.next(new Mo(a.redirectTo, a.navigationBehaviorOptions)));
                      } else throw (this.events.next(s), i);
                    } catch (a) {
                      this.options.resolveNavigationPromiseOnError ? r.resolve(!1) : r.reject(a);
                    }
                  }
                  return Re;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(n, r, o) {
        let i = new Yt(n.id, this.urlSerializer.serialize(n.extractedUrl), r, o);
        (this.events.next(i), n.resolve(!1));
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let n = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),
          r = Ce(this.currentNavigation),
          o = r?.targetBrowserUrl ?? r?.extractedUrl;
        return n.toString() !== o?.toString() && !r?.extras.skipLocationChange;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function e5(e) {
  return e !== Li;
}
var cv = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: () => u(t5), providedIn: 'root' });
    }
    return e;
  })(),
  Fl = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, n) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, n) {
      return t.routeConfig === n.routeConfig;
    }
  },
  t5 = (() => {
    class e extends Fl {
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Tn(e)))(o || e);
        };
      })();
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  dv = (() => {
    class e {
      urlSerializer = u(Ki);
      options = u(Ji, { optional: !0 }) || {};
      canceledNavigationResolution = this.options.canceledNavigationResolution || 'replace';
      location = u(vo);
      urlHandlingStrategy = u(Ul);
      urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred';
      currentUrlTree = new Kt();
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      rawUrlTree = this.currentUrlTree;
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      createBrowserPath({ finalUrl: n, initialUrl: r, targetBrowserUrl: o }) {
        let i = n !== void 0 ? this.urlHandlingStrategy.merge(n, r) : r,
          s = o ?? i;
        return s instanceof Kt ? this.urlSerializer.serialize(s) : s;
      }
      commitTransition({ targetRouterState: n, finalUrl: r, initialUrl: o }) {
        r && n
          ? ((this.currentUrlTree = r),
            (this.rawUrlTree = this.urlHandlingStrategy.merge(r, o)),
            (this.routerState = n))
          : (this.rawUrlTree = o);
      }
      routerState = zf(null);
      getRouterState() {
        return this.routerState;
      }
      stateMemento = this.createStateMemento();
      updateStateMemento() {
        this.stateMemento = this.createStateMemento();
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      resetInternalState({ finalUrl: n }) {
        ((this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n ?? this.rawUrlTree,
          )));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: () => u(n5), providedIn: 'root' });
    }
    return e;
  })(),
  n5 = (() => {
    class e extends dv {
      currentPageId = 0;
      lastSuccessfulId = -1;
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((r) => {
          r.type === 'popstate' &&
            setTimeout(() => {
              n(r.url, r.state, 'popstate');
            });
        });
      }
      handleRouterEvent(n, r) {
        n instanceof Dr
          ? this.updateStateMemento()
          : n instanceof un
            ? this.commitTransition(r)
            : n instanceof Ui
              ? this.urlUpdateStrategy === 'eager' &&
                (r.extras.skipLocationChange || this.setBrowserUrl(this.createBrowserPath(r), r))
              : n instanceof zi
                ? (this.commitTransition(r),
                  this.urlUpdateStrategy === 'deferred' &&
                    !r.extras.skipLocationChange &&
                    this.setBrowserUrl(this.createBrowserPath(r), r))
                : n instanceof Yt &&
                    n.code !== He.SupersededByNewNavigation &&
                    n.code !== He.Redirect
                  ? this.restoreHistory(r)
                  : n instanceof xo
                    ? this.restoreHistory(r, !0)
                    : n instanceof hn &&
                      ((this.lastSuccessfulId = n.id), (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, { extras: r, id: o }) {
        let { replaceUrl: i, state: s } = r;
        if (this.location.isCurrentPathEqualTo(n) || i) {
          let a = this.browserPageId,
            l = w(w({}, s), this.generateNgRouterState(o, a));
          this.location.replaceState(n, '', l);
        } else {
          let a = w(w({}, s), this.generateNgRouterState(o, this.browserPageId + 1));
          this.location.go(n, '', a);
        }
      }
      restoreHistory(n, r = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let o = this.browserPageId,
            i = this.currentPageId - o;
          i !== 0
            ? this.location.historyGo(i)
            : this.getCurrentUrlTree() === n.finalUrl &&
              i === 0 &&
              (this.resetInternalState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === 'replace' &&
            (r && this.resetInternalState(n), this.resetUrlToCurrentUrlTree());
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.getRawUrlTree()),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(n, r) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: n, ɵrouterPageId: r }
          : { navigationId: n };
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Tn(e)))(o || e);
        };
      })();
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function cp(e, t) {
  e.events
    .pipe(
      $e((n) => n instanceof hn || n instanceof Yt || n instanceof xo || n instanceof un),
      G((n) =>
        n instanceof hn || n instanceof un
          ? 0
          : (
                n instanceof Yt
                  ? n.code === He.Redirect || n.code === He.SupersededByNewNavigation
                  : !1
              )
            ? 2
            : 1,
      ),
      $e((n) => n !== 2),
      _t(1),
    )
    .subscribe(() => {
      t();
    });
}
var r5 = { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'exact' },
  o5 = { paths: 'subset', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'subset' },
  zl = (() => {
    class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      disposed = !1;
      nonRouterCurrentEntryChangeSubscription;
      console = u(cu);
      stateManager = u(dv);
      options = u(Ji, { optional: !0 }) || {};
      pendingTasks = u(on);
      urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred';
      navigationTransitions = u(lv);
      urlSerializer = u(Ki);
      location = u(vo);
      urlHandlingStrategy = u(Ul);
      injector = u(ke);
      _events = new P();
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      navigated = !1;
      routeReuseStrategy = u(cv);
      onSameUrlNavigation = this.options.onSameUrlNavigation || 'ignore';
      config = u(es, { optional: !0 })?.flat() ?? [];
      componentInputBindingEnabled = !!u(Vl, { optional: !0 });
      currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
      constructor() {
        (this.resetConfig(this.config),
          this.navigationTransitions.setupNavigations(this).subscribe({
            error: (n) => {
              this.console.warn(n);
            },
          }),
          this.subscribeToNavigationEvents());
      }
      eventsSubscription = new J();
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((r) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              i = Ce(this.navigationTransitions.currentNavigation);
            if (o !== null && i !== null) {
              if (
                (this.stateManager.handleRouterEvent(r, i),
                r instanceof Yt &&
                  r.code !== He.Redirect &&
                  r.code !== He.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof hn) this.navigated = !0;
              else if (r instanceof Mo) {
                let s = r.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                  l = w(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl || this.urlUpdateStrategy === 'eager' || e5(o.source),
                    },
                    s,
                  );
                this.scheduleNavigation(a, Li, null, l, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            rM(r) && this._events.next(r);
          } catch (o) {
            this.navigationTransitions.transitionAbortWithErrorSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        ((this.routerState.root.component = n), (this.navigationTransitions.rootComponentType = n));
      }
      initialNavigation() {
        (this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Li,
              this.stateManager.restoredState(),
            ));
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener((n, r, o) => {
            this.navigateToSyncWithBrowser(n, o, r);
          });
      }
      navigateToSyncWithBrowser(n, r, o) {
        let i = { replaceUrl: !0 },
          s = o?.navigationId ? o : null;
        if (o) {
          let l = w({}, o);
          (delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (i.state = l));
        }
        let a = this.parseUrl(n);
        this.scheduleNavigation(a, r, s, i).catch((l) => {
          this.disposed || this.injector.get(ut)(l);
        });
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return Ce(this.navigationTransitions.currentNavigation);
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        ((this.config = n.map(ap)), (this.navigated = !1));
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        (this._events.unsubscribe(),
          this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe());
      }
      createUrlTree(n, r = {}) {
        let {
            relativeTo: o,
            queryParams: i,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: l,
          } = r,
          c = l ? this.currentUrlTree.fragment : s,
          d = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case 'merge':
            d = w(w({}, this.currentUrlTree.queryParams), i);
            break;
          case 'preserve':
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = i || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let h;
        try {
          let g = o ? o.snapshot : this.routerState.snapshot.root;
          h = Ff(g);
        } catch {
          ((typeof n[0] != 'string' || n[0][0] !== '/') && (n = []),
            (h = this.currentUrlTree.root));
        }
        return Vf(h, n, d, c ?? null);
      }
      navigateByUrl(n, r = { skipLocationChange: !1 }) {
        let o = _o(n) ? n : this.parseUrl(n),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, Li, null, r);
      }
      navigate(n, r = { skipLocationChange: !1 }) {
        return (i5(n), this.navigateByUrl(this.createUrlTree(n, r), r));
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse('/');
        }
      }
      isActive(n, r) {
        let o;
        if ((r === !0 ? (o = w({}, r5)) : r === !1 ? (o = w({}, o5)) : (o = r), _o(n)))
          return yf(this.currentUrlTree, n, o);
        let i = this.parseUrl(n);
        return yf(this.currentUrlTree, i, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce((r, [o, i]) => (i != null && (r[o] = i), r), {});
      }
      scheduleNavigation(n, r, o, i, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, l, c;
        s
          ? ((a = s.resolve), (l = s.reject), (c = s.promise))
          : (c = new Promise((h, g) => {
              ((a = h), (l = g));
            }));
        let d = this.pendingTasks.add();
        return (
          cp(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: i,
            resolve: a,
            reject: l,
            promise: c,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          c.catch((h) => Promise.reject(h))
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function i5(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new b(4008, !1);
}
var a5 = new _('');
function dp(e, ...t) {
  return ni([
    { provide: es, multi: !0, useValue: e },
    [],
    { provide: Fn, useFactory: l5, deps: [zl] },
    { provide: ol, multi: !0, useFactory: c5 },
    t.map((n) => n.ɵproviders),
  ]);
}
function l5(e) {
  return e.routerState.root;
}
function c5() {
  let e = u(pe);
  return (t) => {
    let n = e.get(vt);
    if (t !== n.components[0]) return;
    let r = e.get(zl),
      o = e.get(d5);
    (e.get(h5) === 1 && r.initialNavigation(),
      e.get(u5, null, { optional: !0 })?.setUpPreloading(),
      e.get(a5, null, { optional: !0 })?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe()));
  };
}
var d5 = new _('', { factory: () => new P() }),
  h5 = new _('', { providedIn: 'root', factory: () => 1 });
var u5 = new _('');
var XF = new _('Ng Glyph Config');
var JF = new _('NgGlyphsToken');
function g5(e) {
  return e == null ? '' : /^\d+$/.test(e) ? `${e}px` : e;
}
var f5 = new _('Ng Icon Pre Processor'),
  v5 = new _('Ng Icon Post Processor');
function w5() {
  return u(f5, { optional: !0 }) ?? ((e) => e);
}
function m5() {
  return u(v5, { optional: !0 }) ?? (() => {});
}
var k5 = new _('Ng Icon Logger'),
  hp = class {
    log(t) {
      console.log(t);
    }
    warn(t) {
      console.warn(t);
    }
    error(t) {
      console.error(t);
    }
  };
function y5() {
  return u(k5, { optional: !0 }) ?? new hp();
}
var _5 = new _('Ng Icon Config');
function x5() {
  return u(_5, { optional: !0 }) ?? {};
}
var M5 = new _('Ng Icon Loader Token');
var C5 = new _('Ng Icon Cache Token');
function D5() {
  return u(M5, { optional: !0 });
}
function b5() {
  return u(C5, { optional: !0 });
}
function hv(e) {
  return [
    {
      provide: up,
      useFactory: (t = u(up, { optional: !0, skipSelf: !0 })) =>
        w(
          w(
            {},
            t?.reduce((n, r) => w(w({}, n), r), {}),
          ),
          e,
        ),
      multi: !0,
    },
  ];
}
var up = new _('Icons Token');
function E5() {
  return u(up, { optional: !0 }) ?? [];
}
function S5(e) {
  return typeof e == 'string' ? Promise.resolve(e) : $r(e) ? e.toPromise() : e;
}
function I5(e) {
  return e
    .replace(/([^a-zA-Z0-9])+(.)?/g, (t, n, r) => (r ? r.toUpperCase() : ''))
    .replace(/[^a-zA-Z\d]/g, '')
    .replace(/^([A-Z])/, (t) => t.toLowerCase());
}
var T5 = 0,
  je = (() => {
    let t = class t {
      constructor() {
        ((this.config = x5()),
          (this.icons = E5()),
          (this.loader = D5()),
          (this.cache = b5()),
          (this.preProcessor = w5()),
          (this.postProcessor = m5()),
          (this.injector = u(pe)),
          (this.renderer = u(pt)),
          (this.platform = u(qt)),
          (this.elementRef = u(ge)),
          (this.uniqueId = T5++),
          (this.logger = y5()),
          (this.name = Nn()),
          (this.svg = Nn()),
          (this.size = Nn(this.config.size, { transform: g5 })),
          (this.strokeWidth = Nn(this.config.strokeWidth)),
          (this.color = Nn(this.config.color)),
          On(() => this.updateIcon()),
          u(new Si('aria-hidden'), { optional: !0 }) ||
            this.elementRef.nativeElement.setAttribute('aria-hidden', 'true'));
      }
      ngOnDestroy() {
        this.svgElement = void 0;
      }
      async updateIcon() {
        let r = this.name(),
          o = this.svg();
        if (o !== void 0) {
          this.setSvg(o);
          return;
        }
        if (r === void 0) return;
        let i = I5(r);
        for (let s of [...this.icons].reverse())
          if (s[i]) {
            this.setSvg(s[i]);
            return;
          }
        if (this.loader) {
          let s = await this.requestIconFromLoader(r);
          if (s !== null) {
            this.setSvg(s);
            return;
          }
        }
        this.logger.warn(
          `No icon named ${r} was found. You may need to import it using the withIcons function.`,
        );
      }
      setSvg(r) {
        if (df(this.platform)) {
          ((this.elementRef.nativeElement.innerHTML = r),
            this.elementRef.nativeElement.setAttribute('data-ng-icon-ssr', ''));
          return;
        }
        if (
          (this.elementRef.nativeElement.hasAttribute('data-ng-icon-ssr') &&
            (this.elementRef.nativeElement.removeAttribute('data-ng-icon-ssr'),
            (this.svgElement = this.elementRef.nativeElement.querySelector('svg') ?? void 0),
            this.elementRef.nativeElement.innerHTML === r)) ||
          (this.svgElement &&
            this.renderer.removeChild(this.elementRef.nativeElement, this.svgElement),
          r === '')
        )
          return;
        let o = this.renderer.createElement('template');
        ((r = this.replaceIds(r)),
          this.renderer.setProperty(o, 'innerHTML', this.preProcessor(r)),
          (this.svgElement = o.content.firstElementChild),
          this.postProcessor(this.svgElement),
          this.renderer.appendChild(this.elementRef.nativeElement, this.svgElement));
      }
      replaceIds(r) {
        if (!r.includes('ID_PLACEHOLDER_')) return r;
        let o = /ID_PLACEHOLDER_(\d+)/g,
          i = new Map(),
          s = new Set(r.match(o));
        if (s === null) return r;
        for (let a of s) {
          let l = a.replace('ID_PLACEHOLDER_', ''),
            c = `ng-icon-${this.uniqueId}-${i.size}`;
          (i.set(l, c), (r = r.replace(new RegExp(a, 'g'), c)));
        }
        return r;
      }
      requestIconFromLoader(r) {
        return new Promise((o) => {
          Se(this.injector, async () => {
            if (this.cache) {
              let a = this.cache.get(r);
              if (typeof a == 'string') {
                o(a);
                return;
              }
              if (a instanceof Promise) {
                let l = await a;
                o(l);
                return;
              }
            }
            let i = S5(this.loader(r));
            this.cache?.set(r, i);
            let s = await i;
            (this.cache?.set(r, s), o(s));
          });
        });
      }
    };
    ((t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵcmp = se({
        type: t,
        selectors: [['ng-icon']],
        hostAttrs: ['role', 'img'],
        hostVars: 6,
        hostBindings: function (o, i) {
          o & 2 &&
            Tt('--ng-icon__stroke-width', i.strokeWidth())('--ng-icon__size', i.size())(
              '--ng-icon__color',
              i.color(),
            );
        },
        inputs: {
          name: [1, 'name'],
          svg: [1, 'svg'],
          size: [1, 'size'],
          strokeWidth: [1, 'strokeWidth'],
          color: [1, 'color'],
        },
        decls: 0,
        vars: 0,
        template: function (o, i) {},
        styles: [
          '[_nghost-%COMP%]{display:inline-block;width:var(--ng-icon__size, 1em);height:var(--ng-icon__size, 1em);line-height:initial;vertical-align:initial;overflow:hidden}[_nghost-%COMP%]     svg{width:inherit;height:inherit;vertical-align:inherit}@layer ng-icon{[_nghost-%COMP%]{color:var(--ng-icon__color, currentColor)}}',
        ],
        changeDetection: 0,
      })));
    let e = t;
    return e;
  })();
var pp;
function A5() {
  if (pp == null) {
    let e = typeof document < 'u' ? document.head : null;
    pp = !!(e && (e.createShadowRoot || e.attachShadow));
  }
  return pp;
}
function $l(e) {
  if (A5()) {
    let t = e.getRootNode ? e.getRootNode() : null;
    if (typeof ShadowRoot < 'u' && ShadowRoot && t instanceof ShadowRoot) return t;
  }
  return null;
}
function ts(e) {
  return e.composedPath ? e.composedPath()[0] : e.target;
}
function uv(e) {
  return e.buttons === 0 || e.detail === 0;
}
function pv(e) {
  let t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
  return (
    !!t &&
    t.identifier === -1 &&
    (t.radiusX == null || t.radiusX === 1) &&
    (t.radiusY == null || t.radiusY === 1)
  );
}
function Gl(e, t = 0) {
  return R5(e) ? Number(e) : arguments.length === 2 ? t : 0;
}
function R5(e) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e));
}
function Rt(e) {
  return e instanceof ge ? e.nativeElement : e;
}
var ql = new WeakMap(),
  gv = (() => {
    class e {
      _appRef;
      _injector = u(pe);
      _environmentInjector = u(ke);
      load(n) {
        let r = (this._appRef = this._appRef || this._injector.get(vt)),
          o = ql.get(r);
        (o ||
          ((o = { loaders: new Set(), refs: [] }),
          ql.set(r, o),
          r.onDestroy(() => {
            (ql.get(r)?.refs.forEach((i) => i.destroy()), ql.delete(r));
          })),
          o.loaders.has(n) ||
            (o.loaders.add(n),
            o.refs.push(Qg(n, { environmentInjector: this._environmentInjector }))));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var gp;
try {
  gp = typeof Intl < 'u' && Intl.v8BreakIterator;
} catch {
  gp = !1;
}
var fp = (() => {
  class e {
    _platformId = u(qt);
    isBrowser = this._platformId ? cf(this._platformId) : typeof document == 'object' && !!document;
    EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
    TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
    BLINK =
      this.isBrowser && !!(window.chrome || gp) && typeof CSS < 'u' && !this.EDGE && !this.TRIDENT;
    WEBKIT =
      this.isBrowser &&
      /AppleWebKit/i.test(navigator.userAgent) &&
      !this.BLINK &&
      !this.EDGE &&
      !this.TRIDENT;
    IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
    ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
    SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
    constructor() {}
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var P5 = new _('cdk-dir-doc', { providedIn: 'root', factory: O5 });
function O5() {
  return u(de);
}
var N5 =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function j5(e) {
  let t = e?.toLowerCase() || '';
  return t === 'auto' && typeof navigator < 'u' && navigator?.language
    ? N5.test(navigator.language)
      ? 'rtl'
      : 'ltr'
    : t === 'rtl'
      ? 'rtl'
      : 'ltr';
}
var ns = (() => {
  class e {
    get value() {
      return this.valueSignal();
    }
    valueSignal = W('ltr');
    change = new T();
    constructor() {
      let n = u(P5, { optional: !0 });
      if (n) {
        let r = n.body ? n.body.dir : null,
          o = n.documentElement ? n.documentElement.dir : null;
        this.valueSignal.set(j5(r || o || 'ltr'));
      }
    }
    ngOnDestroy() {
      this.change.complete();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var Pt = (function (e) {
    return (
      (e[(e.NORMAL = 0)] = 'NORMAL'),
      (e[(e.NEGATED = 1)] = 'NEGATED'),
      (e[(e.INVERTED = 2)] = 'INVERTED'),
      e
    );
  })(Pt || {}),
  Wl,
  br;
function fv() {
  if (br == null) {
    if (typeof document != 'object' || !document || typeof Element != 'function' || !Element)
      return ((br = !1), br);
    if ('scrollBehavior' in document.documentElement.style) br = !0;
    else {
      let e = Element.prototype.scrollTo;
      e ? (br = !/\{\s*\[native code\]\s*\}/.test(e.toString())) : (br = !1);
    }
  }
  return br;
}
function Io() {
  if (typeof document != 'object' || !document) return Pt.NORMAL;
  if (Wl == null) {
    let e = document.createElement('div'),
      t = e.style;
    ((e.dir = 'rtl'),
      (t.width = '1px'),
      (t.overflow = 'auto'),
      (t.visibility = 'hidden'),
      (t.pointerEvents = 'none'),
      (t.position = 'absolute'));
    let n = document.createElement('div'),
      r = n.style;
    ((r.width = '2px'),
      (r.height = '1px'),
      e.appendChild(n),
      document.body.appendChild(e),
      (Wl = Pt.NORMAL),
      e.scrollLeft === 0 &&
        ((e.scrollLeft = 1), (Wl = e.scrollLeft === 0 ? Pt.NEGATED : Pt.INVERTED)),
      e.remove());
  }
  return Wl;
}
var vp = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Fe({ type: e });
    static ɵinj = Pe({});
  }
  return e;
})();
var B5 = 20,
  mp = (() => {
    class e {
      _ngZone = u(X);
      _platform = u(fp);
      _renderer = u(Je).createRenderer(null, null);
      _cleanupGlobalListener;
      constructor() {}
      _scrolled = new P();
      _scrolledCount = 0;
      scrollContainers = new Map();
      register(n) {
        this.scrollContainers.has(n) ||
          this.scrollContainers.set(
            n,
            n.elementScrolled().subscribe(() => this._scrolled.next(n)),
          );
      }
      deregister(n) {
        let r = this.scrollContainers.get(n);
        r && (r.unsubscribe(), this.scrollContainers.delete(n));
      }
      scrolled(n = B5) {
        return this._platform.isBrowser
          ? new U((r) => {
              this._cleanupGlobalListener ||
                (this._cleanupGlobalListener = this._ngZone.runOutsideAngular(() =>
                  this._renderer.listen('document', 'scroll', () => this._scrolled.next()),
                ));
              let o = n > 0 ? this._scrolled.pipe(ia(n)).subscribe(r) : this._scrolled.subscribe(r);
              return (
                this._scrolledCount++,
                () => {
                  (o.unsubscribe(),
                    this._scrolledCount--,
                    this._scrolledCount ||
                      (this._cleanupGlobalListener?.(), (this._cleanupGlobalListener = void 0)));
                }
              );
            })
          : j();
      }
      ngOnDestroy() {
        (this._cleanupGlobalListener?.(),
          (this._cleanupGlobalListener = void 0),
          this.scrollContainers.forEach((n, r) => this.deregister(r)),
          this._scrolled.complete());
      }
      ancestorScrolled(n, r) {
        let o = this.getAncestorScrollContainers(n);
        return this.scrolled(r).pipe($e((i) => !i || o.indexOf(i) > -1));
      }
      getAncestorScrollContainers(n) {
        let r = [];
        return (
          this.scrollContainers.forEach((o, i) => {
            this._scrollableContainsElement(i, n) && r.push(i);
          }),
          r
        );
      }
      _scrollableContainsElement(n, r) {
        let o = Rt(r),
          i = n.getElementRef().nativeElement;
        do if (o == i) return !0;
        while ((o = o.parentElement));
        return !1;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  vv = (() => {
    class e {
      elementRef = u(ge);
      scrollDispatcher = u(mp);
      ngZone = u(X);
      dir = u(ns, { optional: !0 });
      _scrollElement = this.elementRef.nativeElement;
      _destroyed = new P();
      _renderer = u(pt);
      _cleanupScroll;
      _elementScrolled = new P();
      constructor() {}
      ngOnInit() {
        ((this._cleanupScroll = this.ngZone.runOutsideAngular(() =>
          this._renderer.listen(this._scrollElement, 'scroll', (n) =>
            this._elementScrolled.next(n),
          ),
        )),
          this.scrollDispatcher.register(this));
      }
      ngOnDestroy() {
        (this._cleanupScroll?.(),
          this._elementScrolled.complete(),
          this.scrollDispatcher.deregister(this),
          this._destroyed.next(),
          this._destroyed.complete());
      }
      elementScrolled() {
        return this._elementScrolled;
      }
      getElementRef() {
        return this.elementRef;
      }
      scrollTo(n) {
        let r = this.elementRef.nativeElement,
          o = this.dir && this.dir.value == 'rtl';
        (n.left == null && (n.left = o ? n.end : n.start),
          n.right == null && (n.right = o ? n.start : n.end),
          n.bottom != null && (n.top = r.scrollHeight - r.clientHeight - n.bottom),
          o && Io() != Pt.NORMAL
            ? (n.left != null && (n.right = r.scrollWidth - r.clientWidth - n.left),
              Io() == Pt.INVERTED
                ? (n.left = n.right)
                : Io() == Pt.NEGATED && (n.left = n.right ? -n.right : n.right))
            : n.right != null && (n.left = r.scrollWidth - r.clientWidth - n.right),
          this._applyScrollToOptions(n));
      }
      _applyScrollToOptions(n) {
        let r = this.elementRef.nativeElement;
        fv()
          ? r.scrollTo(n)
          : (n.top != null && (r.scrollTop = n.top), n.left != null && (r.scrollLeft = n.left));
      }
      measureScrollOffset(n) {
        let r = 'left',
          o = 'right',
          i = this.elementRef.nativeElement;
        if (n == 'top') return i.scrollTop;
        if (n == 'bottom') return i.scrollHeight - i.clientHeight - i.scrollTop;
        let s = this.dir && this.dir.value == 'rtl';
        return (
          n == 'start' ? (n = s ? o : r) : n == 'end' && (n = s ? r : o),
          s && Io() == Pt.INVERTED
            ? n == r
              ? i.scrollWidth - i.clientWidth - i.scrollLeft
              : i.scrollLeft
            : s && Io() == Pt.NEGATED
              ? n == r
                ? i.scrollLeft + i.scrollWidth - i.clientWidth
                : -i.scrollLeft
              : n == r
                ? i.scrollLeft
                : i.scrollWidth - i.clientWidth - i.scrollLeft
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = oe({
        type: e,
        selectors: [
          ['', 'cdk-scrollable', ''],
          ['', 'cdkScrollable', ''],
        ],
      });
    }
    return e;
  })(),
  L5 = 20,
  wv = (() => {
    class e {
      _platform = u(fp);
      _listeners;
      _viewportSize;
      _change = new P();
      _document = u(de);
      constructor() {
        let n = u(X),
          r = u(Je).createRenderer(null, null);
        n.runOutsideAngular(() => {
          if (this._platform.isBrowser) {
            let o = (i) => this._change.next(i);
            this._listeners = [
              r.listen('window', 'resize', o),
              r.listen('window', 'orientationchange', o),
            ];
          }
          this.change().subscribe(() => (this._viewportSize = null));
        });
      }
      ngOnDestroy() {
        (this._listeners?.forEach((n) => n()), this._change.complete());
      }
      getViewportSize() {
        this._viewportSize || this._updateViewportSize();
        let n = { width: this._viewportSize.width, height: this._viewportSize.height };
        return (this._platform.isBrowser || (this._viewportSize = null), n);
      }
      getViewportRect() {
        let n = this.getViewportScrollPosition(),
          { width: r, height: o } = this.getViewportSize();
        return {
          top: n.top,
          left: n.left,
          bottom: n.top + o,
          right: n.left + r,
          height: o,
          width: r,
        };
      }
      getViewportScrollPosition() {
        if (!this._platform.isBrowser) return { top: 0, left: 0 };
        let n = this._document,
          r = this._getWindow(),
          o = n.documentElement,
          i = o.getBoundingClientRect(),
          s = -i.top || n.body.scrollTop || r.scrollY || o.scrollTop || 0,
          a = -i.left || n.body.scrollLeft || r.scrollX || o.scrollLeft || 0;
        return { top: s, left: a };
      }
      change(n = L5) {
        return n > 0 ? this._change.pipe(ia(n)) : this._change;
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _updateViewportSize() {
        let n = this._getWindow();
        this._viewportSize = this._platform.isBrowser
          ? { width: n.innerWidth, height: n.innerHeight }
          : { width: 0, height: 0 };
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
var wp = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = Fe({ type: e });
      static ɵinj = Pe({});
    }
    return e;
  })(),
  mv = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = Fe({ type: e });
      static ɵinj = Pe({ imports: [vp, wp, vp, wp] });
    }
    return e;
  })();
var kp = {},
  kv = (() => {
    class e {
      _appId = u(fo);
      getId(n) {
        return (
          this._appId !== 'ng' && (n += this._appId),
          kp.hasOwnProperty(n) || (kp[n] = 0),
          `${n}${kp[n]++}`
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })();
function yv(e) {
  return Array.isArray(e) ? e : [e];
}
function xp(e) {
  let t = e.cloneNode(!0),
    n = t.querySelectorAll('[id]'),
    r = e.nodeName.toLowerCase();
  t.removeAttribute('id');
  for (let o = 0; o < n.length; o++) n[o].removeAttribute('id');
  return (
    r === 'canvas' ? Mv(e, t) : (r === 'input' || r === 'select' || r === 'textarea') && xv(e, t),
    _v('canvas', e, t, Mv),
    _v('input, textarea, select', e, t, xv),
    t
  );
}
function _v(e, t, n, r) {
  let o = t.querySelectorAll(e);
  if (o.length) {
    let i = n.querySelectorAll(e);
    for (let s = 0; s < o.length; s++) r(o[s], i[s]);
  }
}
var V5 = 0;
function xv(e, t) {
  (t.type !== 'file' && (t.value = e.value),
    t.type === 'radio' && t.name && (t.name = `mat-clone-${t.name}-${V5++}`));
}
function Mv(e, t) {
  let n = t.getContext('2d');
  if (n)
    try {
      n.drawImage(e, 0, 0);
    } catch {}
}
function Tp(e) {
  let t = e.getBoundingClientRect();
  return {
    top: t.top,
    right: t.right,
    bottom: t.bottom,
    left: t.left,
    width: t.width,
    height: t.height,
    x: t.x,
    y: t.y,
  };
}
function Mp(e, t, n) {
  let { top: r, bottom: o, left: i, right: s } = e;
  return n >= r && n <= o && t >= i && t <= s;
}
function H5(e, t) {
  let n = t.left < e.left,
    r = t.left + t.width > e.right,
    o = t.top < e.top,
    i = t.top + t.height > e.bottom;
  return n || r || o || i;
}
function is(e, t, n) {
  ((e.top += t), (e.bottom = e.top + e.height), (e.left += n), (e.right = e.left + e.width));
}
function Cv(e, t, n, r) {
  let { top: o, right: i, bottom: s, left: a, width: l, height: c } = e,
    d = l * t,
    h = c * t;
  return r > o - h && r < s + h && n > a - d && n < i + d;
}
var Zl = class {
  _document;
  positions = new Map();
  constructor(t) {
    this._document = t;
  }
  clear() {
    this.positions.clear();
  }
  cache(t) {
    (this.clear(),
      this.positions.set(this._document, { scrollPosition: this.getViewportScrollPosition() }),
      t.forEach((n) => {
        this.positions.set(n, {
          scrollPosition: { top: n.scrollTop, left: n.scrollLeft },
          clientRect: Tp(n),
        });
      }));
  }
  handleScroll(t) {
    let n = ts(t),
      r = this.positions.get(n);
    if (!r) return null;
    let o = r.scrollPosition,
      i,
      s;
    if (n === this._document) {
      let c = this.getViewportScrollPosition();
      ((i = c.top), (s = c.left));
    } else ((i = n.scrollTop), (s = n.scrollLeft));
    let a = o.top - i,
      l = o.left - s;
    return (
      this.positions.forEach((c, d) => {
        c.clientRect && n !== d && n.contains(d) && is(c.clientRect, a, l);
      }),
      (o.top = i),
      (o.left = s),
      { top: a, left: l }
    );
  }
  getViewportScrollPosition() {
    return { top: window.scrollY, left: window.scrollX };
  }
};
function Nv(e, t) {
  let n = e.rootNodes;
  if (n.length === 1 && n[0].nodeType === t.ELEMENT_NODE) return n[0];
  let r = t.createElement('div');
  return (n.forEach((o) => r.appendChild(o)), r);
}
function Ap(e, t, n) {
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let o = t[r];
      o ? e.setProperty(r, o, n?.has(r) ? 'important' : '') : e.removeProperty(r);
    }
  return e;
}
function To(e, t) {
  let n = t ? '' : 'none';
  Ap(e.style, {
    'touch-action': t ? '' : 'none',
    '-webkit-user-drag': t ? '' : 'none',
    '-webkit-tap-highlight-color': t ? '' : 'transparent',
    'user-select': n,
    '-ms-user-select': n,
    '-webkit-user-select': n,
    '-moz-user-select': n,
  });
}
function Dv(e, t, n) {
  Ap(
    e.style,
    {
      position: t ? '' : 'fixed',
      top: t ? '' : '0',
      opacity: t ? '' : '0',
      left: t ? '' : '-999em',
    },
    n,
  );
}
function Yl(e, t) {
  return t && t != 'none' ? e + ' ' + t : e;
}
function bv(e, t) {
  ((e.style.width = `${t.width}px`),
    (e.style.height = `${t.height}px`),
    (e.style.transform = ss(t.left, t.top)));
}
function ss(e, t) {
  return `translate3d(${Math.round(e)}px, ${Math.round(t)}px, 0)`;
}
function Ev(e) {
  let t = e.toLowerCase().indexOf('ms') > -1 ? 1 : 1e3;
  return parseFloat(e) * t;
}
function U5(e) {
  let t = getComputedStyle(e),
    n = yp(t, 'transition-property'),
    r = n.find((a) => a === 'transform' || a === 'all');
  if (!r) return 0;
  let o = n.indexOf(r),
    i = yp(t, 'transition-duration'),
    s = yp(t, 'transition-delay');
  return Ev(i[o]) + Ev(s[o]);
}
function yp(e, t) {
  return e
    .getPropertyValue(t)
    .split(',')
    .map((r) => r.trim());
}
var z5 = new Set(['position']),
  Cp = class {
    _document;
    _rootElement;
    _direction;
    _initialDomRect;
    _previewTemplate;
    _previewClass;
    _pickupPositionOnPage;
    _initialTransform;
    _zIndex;
    _renderer;
    _previewEmbeddedView;
    _preview;
    get element() {
      return this._preview;
    }
    constructor(t, n, r, o, i, s, a, l, c, d) {
      ((this._document = t),
        (this._rootElement = n),
        (this._direction = r),
        (this._initialDomRect = o),
        (this._previewTemplate = i),
        (this._previewClass = s),
        (this._pickupPositionOnPage = a),
        (this._initialTransform = l),
        (this._zIndex = c),
        (this._renderer = d));
    }
    attach(t) {
      ((this._preview = this._createPreview()),
        t.appendChild(this._preview),
        Sv(this._preview) && this._preview.showPopover());
    }
    destroy() {
      (this._preview.remove(),
        this._previewEmbeddedView?.destroy(),
        (this._preview = this._previewEmbeddedView = null));
    }
    setTransform(t) {
      this._preview.style.transform = t;
    }
    getBoundingClientRect() {
      return this._preview.getBoundingClientRect();
    }
    addClass(t) {
      this._preview.classList.add(t);
    }
    getTransitionDuration() {
      return U5(this._preview);
    }
    addEventListener(t, n) {
      return this._renderer.listen(this._preview, t, n);
    }
    _createPreview() {
      let t = this._previewTemplate,
        n = this._previewClass,
        r = t ? t.template : null,
        o;
      if (r && t) {
        let i = t.matchSize ? this._initialDomRect : null,
          s = t.viewContainer.createEmbeddedView(r, t.context);
        (s.detectChanges(),
          (o = Nv(s, this._document)),
          (this._previewEmbeddedView = s),
          t.matchSize
            ? bv(o, i)
            : (o.style.transform = ss(this._pickupPositionOnPage.x, this._pickupPositionOnPage.y)));
      } else
        ((o = xp(this._rootElement)),
          bv(o, this._initialDomRect),
          this._initialTransform && (o.style.transform = this._initialTransform));
      return (
        Ap(
          o.style,
          {
            'pointer-events': 'none',
            margin: Sv(o) ? '0 auto 0 0' : '0',
            position: 'fixed',
            top: '0',
            left: '0',
            'z-index': this._zIndex + '',
          },
          z5,
        ),
        To(o, !1),
        o.classList.add('cdk-drag-preview'),
        o.setAttribute('popover', 'manual'),
        o.setAttribute('dir', this._direction),
        n && (Array.isArray(n) ? n.forEach((i) => o.classList.add(i)) : o.classList.add(n)),
        o
      );
    }
  };
function Sv(e) {
  return 'showPopover' in e;
}
var $5 = { passive: !0 },
  Iv = { passive: !1 },
  G5 = { passive: !1, capture: !0 },
  q5 = 800,
  Tv = 'cdk-drag-placeholder',
  Av = new Set(['position']),
  Dp = class {
    _config;
    _document;
    _ngZone;
    _viewportRuler;
    _dragDropRegistry;
    _renderer;
    _rootElementCleanups;
    _cleanupShadowRootSelectStart;
    _preview;
    _previewContainer;
    _placeholderRef;
    _placeholder;
    _pickupPositionInElement;
    _pickupPositionOnPage;
    _marker;
    _anchor = null;
    _passiveTransform = { x: 0, y: 0 };
    _activeTransform = { x: 0, y: 0 };
    _initialTransform;
    _hasStartedDragging = W(!1);
    _hasMoved;
    _initialContainer;
    _initialIndex;
    _parentPositions;
    _moveEvents = new P();
    _pointerDirectionDelta;
    _pointerPositionAtLastDirectionChange;
    _lastKnownPointerPosition;
    _rootElement;
    _ownerSVGElement;
    _rootElementTapHighlight;
    _pointerMoveSubscription = J.EMPTY;
    _pointerUpSubscription = J.EMPTY;
    _scrollSubscription = J.EMPTY;
    _resizeSubscription = J.EMPTY;
    _lastTouchEventTime;
    _dragStartTime;
    _boundaryElement = null;
    _nativeInteractionsEnabled = !0;
    _initialDomRect;
    _previewRect;
    _boundaryRect;
    _previewTemplate;
    _placeholderTemplate;
    _handles = [];
    _disabledHandles = new Set();
    _dropContainer;
    _direction = 'ltr';
    _parentDragRef;
    _cachedShadowRoot;
    lockAxis;
    dragStartDelay = 0;
    previewClass;
    scale = 1;
    get disabled() {
      return this._disabled || !!(this._dropContainer && this._dropContainer.disabled);
    }
    set disabled(t) {
      t !== this._disabled &&
        ((this._disabled = t),
        this._toggleNativeDragInteractions(),
        this._handles.forEach((n) => To(n, t)));
    }
    _disabled = !1;
    beforeStarted = new P();
    started = new P();
    released = new P();
    ended = new P();
    entered = new P();
    exited = new P();
    dropped = new P();
    moved = this._moveEvents;
    data;
    constrainPosition;
    constructor(t, n, r, o, i, s, a) {
      ((this._config = n),
        (this._document = r),
        (this._ngZone = o),
        (this._viewportRuler = i),
        (this._dragDropRegistry = s),
        (this._renderer = a),
        this.withRootElement(t).withParent(n.parentDragRef || null),
        (this._parentPositions = new Zl(r)),
        s.registerDragItem(this));
    }
    getPlaceholderElement() {
      return this._placeholder;
    }
    getRootElement() {
      return this._rootElement;
    }
    getVisibleElement() {
      return this.isDragging() ? this.getPlaceholderElement() : this.getRootElement();
    }
    withHandles(t) {
      ((this._handles = t.map((r) => Rt(r))),
        this._handles.forEach((r) => To(r, this.disabled)),
        this._toggleNativeDragInteractions());
      let n = new Set();
      return (
        this._disabledHandles.forEach((r) => {
          this._handles.indexOf(r) > -1 && n.add(r);
        }),
        (this._disabledHandles = n),
        this
      );
    }
    withPreviewTemplate(t) {
      return ((this._previewTemplate = t), this);
    }
    withPlaceholderTemplate(t) {
      return ((this._placeholderTemplate = t), this);
    }
    withRootElement(t) {
      let n = Rt(t);
      if (n !== this._rootElement) {
        this._removeRootElementListeners();
        let r = this._renderer;
        ((this._rootElementCleanups = this._ngZone.runOutsideAngular(() => [
          r.listen(n, 'mousedown', this._pointerDown, Iv),
          r.listen(n, 'touchstart', this._pointerDown, $5),
          r.listen(n, 'dragstart', this._nativeDragStart, Iv),
        ])),
          (this._initialTransform = void 0),
          (this._rootElement = n));
      }
      return (
        typeof SVGElement < 'u' &&
          this._rootElement instanceof SVGElement &&
          (this._ownerSVGElement = this._rootElement.ownerSVGElement),
        this
      );
    }
    withBoundaryElement(t) {
      return (
        (this._boundaryElement = t ? Rt(t) : null),
        this._resizeSubscription.unsubscribe(),
        t &&
          (this._resizeSubscription = this._viewportRuler
            .change(10)
            .subscribe(() => this._containInsideBoundaryOnResize())),
        this
      );
    }
    withParent(t) {
      return ((this._parentDragRef = t), this);
    }
    dispose() {
      (this._removeRootElementListeners(),
        this.isDragging() && this._rootElement?.remove(),
        this._marker?.remove(),
        this._destroyPreview(),
        this._destroyPlaceholder(),
        this._dragDropRegistry.removeDragItem(this),
        this._removeListeners(),
        this.beforeStarted.complete(),
        this.started.complete(),
        this.released.complete(),
        this.ended.complete(),
        this.entered.complete(),
        this.exited.complete(),
        this.dropped.complete(),
        this._moveEvents.complete(),
        (this._handles = []),
        this._disabledHandles.clear(),
        (this._dropContainer = void 0),
        this._resizeSubscription.unsubscribe(),
        this._parentPositions.clear(),
        (this._boundaryElement =
          this._rootElement =
          this._ownerSVGElement =
          this._placeholderTemplate =
          this._previewTemplate =
          this._marker =
          this._parentDragRef =
            null));
    }
    isDragging() {
      return this._hasStartedDragging() && this._dragDropRegistry.isDragging(this);
    }
    reset() {
      ((this._rootElement.style.transform = this._initialTransform || ''),
        (this._activeTransform = { x: 0, y: 0 }),
        (this._passiveTransform = { x: 0, y: 0 }));
    }
    resetToBoundary() {
      if (
        this._boundaryElement &&
        this._rootElement &&
        H5(this._boundaryElement.getBoundingClientRect(), this._rootElement.getBoundingClientRect())
      ) {
        let t = this._boundaryElement.getBoundingClientRect(),
          n = this._rootElement.getBoundingClientRect(),
          r = 0,
          o = 0;
        (n.left < t.left ? (r = t.left - n.left) : n.right > t.right && (r = t.right - n.right),
          n.top < t.top ? (o = t.top - n.top) : n.bottom > t.bottom && (o = t.bottom - n.bottom));
        let i = this._activeTransform.x,
          s = this._activeTransform.y,
          a = i + r,
          l = s + o;
        ((this._rootElement.style.transform = ss(a, l)),
          (this._activeTransform = { x: a, y: l }),
          (this._passiveTransform = { x: a, y: l }));
      }
    }
    disableHandle(t) {
      !this._disabledHandles.has(t) &&
        this._handles.indexOf(t) > -1 &&
        (this._disabledHandles.add(t), To(t, !0));
    }
    enableHandle(t) {
      this._disabledHandles.has(t) && (this._disabledHandles.delete(t), To(t, this.disabled));
    }
    withDirection(t) {
      return ((this._direction = t), this);
    }
    _withDropContainer(t) {
      this._dropContainer = t;
    }
    getFreeDragPosition() {
      let t = this.isDragging() ? this._activeTransform : this._passiveTransform;
      return { x: t.x, y: t.y };
    }
    setFreeDragPosition(t) {
      return (
        (this._activeTransform = { x: 0, y: 0 }),
        (this._passiveTransform.x = t.x),
        (this._passiveTransform.y = t.y),
        this._dropContainer || this._applyRootElementTransform(t.x, t.y),
        this
      );
    }
    withPreviewContainer(t) {
      return ((this._previewContainer = t), this);
    }
    _sortFromLastPointerPosition() {
      let t = this._lastKnownPointerPosition;
      t &&
        this._dropContainer &&
        this._updateActiveDropContainer(this._getConstrainedPointerPosition(t), t);
    }
    _removeListeners() {
      (this._pointerMoveSubscription.unsubscribe(),
        this._pointerUpSubscription.unsubscribe(),
        this._scrollSubscription.unsubscribe(),
        this._cleanupShadowRootSelectStart?.(),
        (this._cleanupShadowRootSelectStart = void 0));
    }
    _destroyPreview() {
      (this._preview?.destroy(), (this._preview = null));
    }
    _destroyPlaceholder() {
      (this._anchor?.remove(),
        this._placeholder?.remove(),
        this._placeholderRef?.destroy(),
        (this._placeholder = this._anchor = this._placeholderRef = null));
    }
    _pointerDown = (t) => {
      if ((this.beforeStarted.next(), this._handles.length)) {
        let n = this._getTargetHandle(t);
        n && !this._disabledHandles.has(n) && !this.disabled && this._initializeDragSequence(n, t);
      } else this.disabled || this._initializeDragSequence(this._rootElement, t);
    };
    _pointerMove = (t) => {
      let n = this._getPointerPositionOnPage(t);
      if (!this._hasStartedDragging()) {
        let o = Math.abs(n.x - this._pickupPositionOnPage.x),
          i = Math.abs(n.y - this._pickupPositionOnPage.y);
        if (o + i >= this._config.dragStartThreshold) {
          let a = Date.now() >= this._dragStartTime + this._getDragStartDelay(t),
            l = this._dropContainer;
          if (!a) {
            this._endDragSequence(t);
            return;
          }
          (!l || (!l.isDragging() && !l.isReceiving())) &&
            (t.cancelable && t.preventDefault(),
            this._hasStartedDragging.set(!0),
            this._ngZone.run(() => this._startDragSequence(t)));
        }
        return;
      }
      t.cancelable && t.preventDefault();
      let r = this._getConstrainedPointerPosition(n);
      if (
        ((this._hasMoved = !0),
        (this._lastKnownPointerPosition = n),
        this._updatePointerDirectionDelta(r),
        this._dropContainer)
      )
        this._updateActiveDropContainer(r, n);
      else {
        let o = this.constrainPosition ? this._initialDomRect : this._pickupPositionOnPage,
          i = this._activeTransform;
        ((i.x = r.x - o.x + this._passiveTransform.x),
          (i.y = r.y - o.y + this._passiveTransform.y),
          this._applyRootElementTransform(i.x, i.y));
      }
      this._moveEvents.observers.length &&
        this._ngZone.run(() => {
          this._moveEvents.next({
            source: this,
            pointerPosition: r,
            event: t,
            distance: this._getDragDistance(r),
            delta: this._pointerDirectionDelta,
          });
        });
    };
    _pointerUp = (t) => {
      this._endDragSequence(t);
    };
    _endDragSequence(t) {
      if (
        this._dragDropRegistry.isDragging(this) &&
        (this._removeListeners(),
        this._dragDropRegistry.stopDragging(this),
        this._toggleNativeDragInteractions(),
        this._handles &&
          (this._rootElement.style.webkitTapHighlightColor = this._rootElementTapHighlight),
        !!this._hasStartedDragging())
      )
        if ((this.released.next({ source: this, event: t }), this._dropContainer))
          (this._dropContainer._stopScrolling(),
            this._animatePreviewToPlaceholder().then(() => {
              (this._cleanupDragArtifacts(t),
                this._cleanupCachedDimensions(),
                this._dragDropRegistry.stopDragging(this));
            }));
        else {
          this._passiveTransform.x = this._activeTransform.x;
          let n = this._getPointerPositionOnPage(t);
          ((this._passiveTransform.y = this._activeTransform.y),
            this._ngZone.run(() => {
              this.ended.next({
                source: this,
                distance: this._getDragDistance(n),
                dropPoint: n,
                event: t,
              });
            }),
            this._cleanupCachedDimensions(),
            this._dragDropRegistry.stopDragging(this));
        }
    }
    _startDragSequence(t) {
      (rs(t) && (this._lastTouchEventTime = Date.now()), this._toggleNativeDragInteractions());
      let n = this._getShadowRoot(),
        r = this._dropContainer;
      if (
        (n &&
          this._ngZone.runOutsideAngular(() => {
            this._cleanupShadowRootSelectStart = this._renderer.listen(n, 'selectstart', W5, G5);
          }),
        r)
      ) {
        let o = this._rootElement,
          i = o.parentNode,
          s = (this._placeholder = this._createPlaceholderElement()),
          a = (this._marker = this._marker || this._document.createComment(''));
        (i.insertBefore(a, o),
          (this._initialTransform = o.style.transform || ''),
          (this._preview = new Cp(
            this._document,
            this._rootElement,
            this._direction,
            this._initialDomRect,
            this._previewTemplate || null,
            this.previewClass || null,
            this._pickupPositionOnPage,
            this._initialTransform,
            this._config.zIndex || 1e3,
            this._renderer,
          )),
          this._preview.attach(this._getPreviewInsertionPoint(i, n)),
          Dv(o, !1, Av),
          this._document.body.appendChild(i.replaceChild(s, o)),
          this.started.next({ source: this, event: t }),
          r.start(),
          (this._initialContainer = r),
          (this._initialIndex = r.getItemIndex(this)));
      } else
        (this.started.next({ source: this, event: t }),
          (this._initialContainer = this._initialIndex = void 0));
      this._parentPositions.cache(r ? r.getScrollableParents() : []);
    }
    _initializeDragSequence(t, n) {
      this._parentDragRef && n.stopPropagation();
      let r = this.isDragging(),
        o = rs(n),
        i = !o && n.button !== 0,
        s = this._rootElement,
        a = ts(n),
        l = !o && this._lastTouchEventTime && this._lastTouchEventTime + q5 > Date.now(),
        c = o ? pv(n) : uv(n);
      if ((a && a.draggable && n.type === 'mousedown' && n.preventDefault(), r || i || l || c))
        return;
      if (this._handles.length) {
        let g = s.style;
        ((this._rootElementTapHighlight = g.webkitTapHighlightColor || ''),
          (g.webkitTapHighlightColor = 'transparent'));
      }
      ((this._hasMoved = !1),
        this._hasStartedDragging.set(this._hasMoved),
        this._removeListeners(),
        (this._initialDomRect = this._rootElement.getBoundingClientRect()),
        (this._pointerMoveSubscription = this._dragDropRegistry.pointerMove.subscribe(
          this._pointerMove,
        )),
        (this._pointerUpSubscription = this._dragDropRegistry.pointerUp.subscribe(this._pointerUp)),
        (this._scrollSubscription = this._dragDropRegistry
          .scrolled(this._getShadowRoot())
          .subscribe((g) => this._updateOnScroll(g))),
        this._boundaryElement && (this._boundaryRect = Tp(this._boundaryElement)));
      let d = this._previewTemplate;
      this._pickupPositionInElement =
        d && d.template && !d.matchSize
          ? { x: 0, y: 0 }
          : this._getPointerPositionInElement(this._initialDomRect, t, n);
      let h =
        (this._pickupPositionOnPage =
        this._lastKnownPointerPosition =
          this._getPointerPositionOnPage(n));
      ((this._pointerDirectionDelta = { x: 0, y: 0 }),
        (this._pointerPositionAtLastDirectionChange = { x: h.x, y: h.y }),
        (this._dragStartTime = Date.now()),
        this._dragDropRegistry.startDragging(this, n));
    }
    _cleanupDragArtifacts(t) {
      (Dv(this._rootElement, !0, Av),
        this._marker.parentNode.replaceChild(this._rootElement, this._marker),
        this._destroyPreview(),
        this._destroyPlaceholder(),
        (this._initialDomRect =
          this._boundaryRect =
          this._previewRect =
          this._initialTransform =
            void 0),
        this._ngZone.run(() => {
          let n = this._dropContainer,
            r = n.getItemIndex(this),
            o = this._getPointerPositionOnPage(t),
            i = this._getDragDistance(o),
            s = n._isOverContainer(o.x, o.y);
          (this.ended.next({ source: this, distance: i, dropPoint: o, event: t }),
            this.dropped.next({
              item: this,
              currentIndex: r,
              previousIndex: this._initialIndex,
              container: n,
              previousContainer: this._initialContainer,
              isPointerOverContainer: s,
              distance: i,
              dropPoint: o,
              event: t,
            }),
            n.drop(this, r, this._initialIndex, this._initialContainer, s, i, o, t),
            (this._dropContainer = this._initialContainer));
        }));
    }
    _updateActiveDropContainer({ x: t, y: n }, { x: r, y: o }) {
      let i = this._initialContainer._getSiblingContainerFromPosition(this, t, n);
      (!i &&
        this._dropContainer !== this._initialContainer &&
        this._initialContainer._isOverContainer(t, n) &&
        (i = this._initialContainer),
        i &&
          i !== this._dropContainer &&
          this._ngZone.run(() => {
            let s = this._dropContainer.getItemIndex(this),
              a = this._dropContainer.getItemAtIndex(s + 1)?.getVisibleElement() || null;
            (this.exited.next({ item: this, container: this._dropContainer }),
              this._dropContainer.exit(this),
              this._conditionallyInsertAnchor(i, this._dropContainer, a),
              (this._dropContainer = i),
              this._dropContainer.enter(
                this,
                t,
                n,
                i === this._initialContainer && i.sortingDisabled ? this._initialIndex : void 0,
              ),
              this.entered.next({ item: this, container: i, currentIndex: i.getItemIndex(this) }));
          }),
        this.isDragging() &&
          (this._dropContainer._startScrollingIfNecessary(r, o),
          this._dropContainer._sortItem(this, t, n, this._pointerDirectionDelta),
          this.constrainPosition
            ? this._applyPreviewTransform(t, n)
            : this._applyPreviewTransform(
                t - this._pickupPositionInElement.x,
                n - this._pickupPositionInElement.y,
              )));
    }
    _animatePreviewToPlaceholder() {
      if (!this._hasMoved) return Promise.resolve();
      let t = this._placeholder.getBoundingClientRect();
      (this._preview.addClass('cdk-drag-animating'), this._applyPreviewTransform(t.left, t.top));
      let n = this._preview.getTransitionDuration();
      return n === 0
        ? Promise.resolve()
        : this._ngZone.runOutsideAngular(
            () =>
              new Promise((r) => {
                let o = (a) => {
                    (!a ||
                      (this._preview &&
                        ts(a) === this._preview.element &&
                        a.propertyName === 'transform')) &&
                      (s(), r(), clearTimeout(i));
                  },
                  i = setTimeout(o, n * 1.5),
                  s = this._preview.addEventListener('transitionend', o);
              }),
          );
    }
    _createPlaceholderElement() {
      let t = this._placeholderTemplate,
        n = t ? t.template : null,
        r;
      return (
        n
          ? ((this._placeholderRef = t.viewContainer.createEmbeddedView(n, t.context)),
            this._placeholderRef.detectChanges(),
            (r = Nv(this._placeholderRef, this._document)))
          : (r = xp(this._rootElement)),
        (r.style.pointerEvents = 'none'),
        r.classList.add(Tv),
        r
      );
    }
    _getPointerPositionInElement(t, n, r) {
      let o = n === this._rootElement ? null : n,
        i = o ? o.getBoundingClientRect() : t,
        s = rs(r) ? r.targetTouches[0] : r,
        a = this._getViewportScrollPosition(),
        l = s.pageX - i.left - a.left,
        c = s.pageY - i.top - a.top;
      return { x: i.left - t.left + l, y: i.top - t.top + c };
    }
    _getPointerPositionOnPage(t) {
      let n = this._getViewportScrollPosition(),
        r = rs(t) ? t.touches[0] || t.changedTouches[0] || { pageX: 0, pageY: 0 } : t,
        o = r.pageX - n.left,
        i = r.pageY - n.top;
      if (this._ownerSVGElement) {
        let s = this._ownerSVGElement.getScreenCTM();
        if (s) {
          let a = this._ownerSVGElement.createSVGPoint();
          return ((a.x = o), (a.y = i), a.matrixTransform(s.inverse()));
        }
      }
      return { x: o, y: i };
    }
    _getConstrainedPointerPosition(t) {
      let n = this._dropContainer ? this._dropContainer.lockAxis : null,
        { x: r, y: o } = this.constrainPosition
          ? this.constrainPosition(t, this, this._initialDomRect, this._pickupPositionInElement)
          : t;
      if (
        (this.lockAxis === 'x' || n === 'x'
          ? (o =
              this._pickupPositionOnPage.y -
              (this.constrainPosition ? this._pickupPositionInElement.y : 0))
          : (this.lockAxis === 'y' || n === 'y') &&
            (r =
              this._pickupPositionOnPage.x -
              (this.constrainPosition ? this._pickupPositionInElement.x : 0)),
        this._boundaryRect)
      ) {
        let { x: i, y: s } = this.constrainPosition
            ? { x: 0, y: 0 }
            : this._pickupPositionInElement,
          a = this._boundaryRect,
          { width: l, height: c } = this._getPreviewRect(),
          d = a.top + s,
          h = a.bottom - (c - s),
          g = a.left + i,
          p = a.right - (l - i);
        ((r = Rv(r, g, p)), (o = Rv(o, d, h)));
      }
      return { x: r, y: o };
    }
    _updatePointerDirectionDelta(t) {
      let { x: n, y: r } = t,
        o = this._pointerDirectionDelta,
        i = this._pointerPositionAtLastDirectionChange,
        s = Math.abs(n - i.x),
        a = Math.abs(r - i.y);
      return (
        s > this._config.pointerDirectionChangeThreshold && ((o.x = n > i.x ? 1 : -1), (i.x = n)),
        a > this._config.pointerDirectionChangeThreshold && ((o.y = r > i.y ? 1 : -1), (i.y = r)),
        o
      );
    }
    _toggleNativeDragInteractions() {
      if (!this._rootElement || !this._handles) return;
      let t = this._handles.length > 0 || !this.isDragging();
      t !== this._nativeInteractionsEnabled &&
        ((this._nativeInteractionsEnabled = t), To(this._rootElement, t));
    }
    _removeRootElementListeners() {
      (this._rootElementCleanups?.forEach((t) => t()), (this._rootElementCleanups = void 0));
    }
    _applyRootElementTransform(t, n) {
      let r = 1 / this.scale,
        o = ss(t * r, n * r),
        i = this._rootElement.style;
      (this._initialTransform == null &&
        (this._initialTransform = i.transform && i.transform != 'none' ? i.transform : ''),
        (i.transform = Yl(o, this._initialTransform)));
    }
    _applyPreviewTransform(t, n) {
      let r = this._previewTemplate?.template ? void 0 : this._initialTransform,
        o = ss(t, n);
      this._preview.setTransform(Yl(o, r));
    }
    _getDragDistance(t) {
      let n = this._pickupPositionOnPage;
      return n ? { x: t.x - n.x, y: t.y - n.y } : { x: 0, y: 0 };
    }
    _cleanupCachedDimensions() {
      ((this._boundaryRect = this._previewRect = void 0), this._parentPositions.clear());
    }
    _containInsideBoundaryOnResize() {
      let { x: t, y: n } = this._passiveTransform;
      if ((t === 0 && n === 0) || this.isDragging() || !this._boundaryElement) return;
      let r = this._rootElement.getBoundingClientRect(),
        o = this._boundaryElement.getBoundingClientRect();
      if ((o.width === 0 && o.height === 0) || (r.width === 0 && r.height === 0)) return;
      let i = o.left - r.left,
        s = r.right - o.right,
        a = o.top - r.top,
        l = r.bottom - o.bottom;
      (o.width > r.width ? (i > 0 && (t += i), s > 0 && (t -= s)) : (t = 0),
        o.height > r.height ? (a > 0 && (n += a), l > 0 && (n -= l)) : (n = 0),
        (t !== this._passiveTransform.x || n !== this._passiveTransform.y) &&
          this.setFreeDragPosition({ y: n, x: t }));
    }
    _getDragStartDelay(t) {
      let n = this.dragStartDelay;
      return typeof n == 'number' ? n : rs(t) ? n.touch : n ? n.mouse : 0;
    }
    _updateOnScroll(t) {
      let n = this._parentPositions.handleScroll(t);
      if (n) {
        let r = ts(t);
        (this._boundaryRect &&
          r !== this._boundaryElement &&
          r.contains(this._boundaryElement) &&
          is(this._boundaryRect, n.top, n.left),
          (this._pickupPositionOnPage.x += n.left),
          (this._pickupPositionOnPage.y += n.top),
          this._dropContainer ||
            ((this._activeTransform.x -= n.left),
            (this._activeTransform.y -= n.top),
            this._applyRootElementTransform(this._activeTransform.x, this._activeTransform.y)));
      }
    }
    _getViewportScrollPosition() {
      return (
        this._parentPositions.positions.get(this._document)?.scrollPosition ||
        this._parentPositions.getViewportScrollPosition()
      );
    }
    _getShadowRoot() {
      return (
        this._cachedShadowRoot === void 0 && (this._cachedShadowRoot = $l(this._rootElement)),
        this._cachedShadowRoot
      );
    }
    _getPreviewInsertionPoint(t, n) {
      let r = this._previewContainer || 'global';
      if (r === 'parent') return t;
      if (r === 'global') {
        let o = this._document;
        return (
          n ||
          o.fullscreenElement ||
          o.webkitFullscreenElement ||
          o.mozFullScreenElement ||
          o.msFullscreenElement ||
          o.body
        );
      }
      return Rt(r);
    }
    _getPreviewRect() {
      return (
        (!this._previewRect || (!this._previewRect.width && !this._previewRect.height)) &&
          (this._previewRect = this._preview
            ? this._preview.getBoundingClientRect()
            : this._initialDomRect),
        this._previewRect
      );
    }
    _nativeDragStart = (t) => {
      if (this._handles.length) {
        let n = this._getTargetHandle(t);
        n && !this._disabledHandles.has(n) && !this.disabled && t.preventDefault();
      } else this.disabled || t.preventDefault();
    };
    _getTargetHandle(t) {
      return this._handles.find((n) => t.target && (t.target === n || n.contains(t.target)));
    }
    _conditionallyInsertAnchor(t, n, r) {
      if (t === this._initialContainer) (this._anchor?.remove(), (this._anchor = null));
      else if (n === this._initialContainer && n.hasAnchor) {
        let o = (this._anchor ??= xp(this._placeholder));
        (o.classList.remove(Tv),
          o.classList.add('cdk-drag-anchor'),
          (o.style.transform = ''),
          r ? r.before(o) : Rt(n.element).appendChild(o));
      }
    }
  };
function Rv(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function rs(e) {
  return e.type[0] === 't';
}
function W5(e) {
  e.preventDefault();
}
function jv(e, t, n) {
  let r = Pv(t, e.length - 1),
    o = Pv(n, e.length - 1);
  if (r === o) return;
  let i = e[r],
    s = o < r ? -1 : 1;
  for (let a = r; a !== o; a += s) e[a] = e[a + s];
  e[o] = i;
}
function Pv(e, t) {
  return Math.max(0, Math.min(t, e));
}
var Kl = class {
    _dragDropRegistry;
    _element;
    _sortPredicate;
    _itemPositions = [];
    _activeDraggables;
    orientation = 'vertical';
    direction;
    constructor(t) {
      this._dragDropRegistry = t;
    }
    _previousSwap = { drag: null, delta: 0, overlaps: !1 };
    start(t) {
      this.withItems(t);
    }
    sort(t, n, r, o) {
      let i = this._itemPositions,
        s = this._getItemIndexFromPointerPosition(t, n, r, o);
      if (s === -1 && i.length > 0) return null;
      let a = this.orientation === 'horizontal',
        l = i.findIndex((L) => L.drag === t),
        c = i[s],
        d = i[l].clientRect,
        h = c.clientRect,
        g = l > s ? 1 : -1,
        p = this._getItemOffsetPx(d, h, g),
        x = this._getSiblingOffsetPx(l, i, g),
        R = i.slice();
      return (
        jv(i, l, s),
        i.forEach((L, Z) => {
          if (R[Z] === L) return;
          let ms = L.drag === t,
            gn = ms ? p : x,
            Qp = ms ? t.getPlaceholderElement() : L.drag.getRootElement();
          L.offset += gn;
          let Xp = Math.round(L.offset * (1 / L.drag.scale));
          a
            ? ((Qp.style.transform = Yl(`translate3d(${Xp}px, 0, 0)`, L.initialTransform)),
              is(L.clientRect, 0, gn))
            : ((Qp.style.transform = Yl(`translate3d(0, ${Xp}px, 0)`, L.initialTransform)),
              is(L.clientRect, gn, 0));
        }),
        (this._previousSwap.overlaps = Mp(h, n, r)),
        (this._previousSwap.drag = c.drag),
        (this._previousSwap.delta = a ? o.x : o.y),
        { previousIndex: l, currentIndex: s }
      );
    }
    enter(t, n, r, o) {
      let i = o == null || o < 0 ? this._getItemIndexFromPointerPosition(t, n, r) : o,
        s = this._activeDraggables,
        a = s.indexOf(t),
        l = t.getPlaceholderElement(),
        c = s[i];
      if (
        (c === t && (c = s[i + 1]),
        !c &&
          (i == null || i === -1 || i < s.length - 1) &&
          this._shouldEnterAsFirstChild(n, r) &&
          (c = s[0]),
        a > -1 && s.splice(a, 1),
        c && !this._dragDropRegistry.isDragging(c))
      ) {
        let d = c.getRootElement();
        (d.parentElement.insertBefore(l, d), s.splice(i, 0, t));
      } else (this._element.appendChild(l), s.push(t));
      ((l.style.transform = ''), this._cacheItemPositions());
    }
    withItems(t) {
      ((this._activeDraggables = t.slice()), this._cacheItemPositions());
    }
    withSortPredicate(t) {
      this._sortPredicate = t;
    }
    reset() {
      (this._activeDraggables?.forEach((t) => {
        let n = t.getRootElement();
        if (n) {
          let r = this._itemPositions.find((o) => o.drag === t)?.initialTransform;
          n.style.transform = r || '';
        }
      }),
        (this._itemPositions = []),
        (this._activeDraggables = []),
        (this._previousSwap.drag = null),
        (this._previousSwap.delta = 0),
        (this._previousSwap.overlaps = !1));
    }
    getActiveItemsSnapshot() {
      return this._activeDraggables;
    }
    getItemIndex(t) {
      return this._getVisualItemPositions().findIndex((n) => n.drag === t);
    }
    getItemAtIndex(t) {
      return this._getVisualItemPositions()[t]?.drag || null;
    }
    updateOnScroll(t, n) {
      (this._itemPositions.forEach(({ clientRect: r }) => {
        is(r, t, n);
      }),
        this._itemPositions.forEach(({ drag: r }) => {
          this._dragDropRegistry.isDragging(r) && r._sortFromLastPointerPosition();
        }));
    }
    withElementContainer(t) {
      this._element = t;
    }
    _cacheItemPositions() {
      let t = this.orientation === 'horizontal';
      this._itemPositions = this._activeDraggables
        .map((n) => {
          let r = n.getVisibleElement();
          return {
            drag: n,
            offset: 0,
            initialTransform: r.style.transform || '',
            clientRect: Tp(r),
          };
        })
        .sort((n, r) =>
          t ? n.clientRect.left - r.clientRect.left : n.clientRect.top - r.clientRect.top,
        );
    }
    _getVisualItemPositions() {
      return this.orientation === 'horizontal' && this.direction === 'rtl'
        ? this._itemPositions.slice().reverse()
        : this._itemPositions;
    }
    _getItemOffsetPx(t, n, r) {
      let o = this.orientation === 'horizontal',
        i = o ? n.left - t.left : n.top - t.top;
      return (r === -1 && (i += o ? n.width - t.width : n.height - t.height), i);
    }
    _getSiblingOffsetPx(t, n, r) {
      let o = this.orientation === 'horizontal',
        i = n[t].clientRect,
        s = n[t + r * -1],
        a = i[o ? 'width' : 'height'] * r;
      if (s) {
        let l = o ? 'left' : 'top',
          c = o ? 'right' : 'bottom';
        r === -1 ? (a -= s.clientRect[l] - i[c]) : (a += i[l] - s.clientRect[c]);
      }
      return a;
    }
    _shouldEnterAsFirstChild(t, n) {
      if (!this._activeDraggables.length) return !1;
      let r = this._itemPositions,
        o = this.orientation === 'horizontal';
      if (r[0].drag !== this._activeDraggables[0]) {
        let s = r[r.length - 1].clientRect;
        return o ? t >= s.right : n >= s.bottom;
      } else {
        let s = r[0].clientRect;
        return o ? t <= s.left : n <= s.top;
      }
    }
    _getItemIndexFromPointerPosition(t, n, r, o) {
      let i = this.orientation === 'horizontal',
        s = this._itemPositions.findIndex(({ drag: a, clientRect: l }) => {
          if (a === t) return !1;
          if (o) {
            let c = i ? o.x : o.y;
            if (
              a === this._previousSwap.drag &&
              this._previousSwap.overlaps &&
              c === this._previousSwap.delta
            )
              return !1;
          }
          return i
            ? n >= Math.floor(l.left) && n < Math.floor(l.right)
            : r >= Math.floor(l.top) && r < Math.floor(l.bottom);
        });
      return s === -1 || !this._sortPredicate(s, t) ? -1 : s;
    }
  },
  bp = class {
    _document;
    _dragDropRegistry;
    _element;
    _sortPredicate;
    _rootNode;
    _activeItems;
    _previousSwap = { drag: null, deltaX: 0, deltaY: 0, overlaps: !1 };
    _relatedNodes = [];
    constructor(t, n) {
      ((this._document = t), (this._dragDropRegistry = n));
    }
    start(t) {
      let n = this._element.childNodes;
      this._relatedNodes = [];
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        this._relatedNodes.push([o, o.nextSibling]);
      }
      this.withItems(t);
    }
    sort(t, n, r, o) {
      let i = this._getItemIndexFromPointerPosition(t, n, r),
        s = this._previousSwap;
      if (i === -1 || this._activeItems[i] === t) return null;
      let a = this._activeItems[i];
      if (s.drag === a && s.overlaps && s.deltaX === o.x && s.deltaY === o.y) return null;
      let l = this.getItemIndex(t),
        c = t.getPlaceholderElement(),
        d = a.getRootElement();
      (i > l ? d.after(c) : d.before(c), jv(this._activeItems, l, i));
      let h = this._getRootNode().elementFromPoint(n, r);
      return (
        (s.deltaX = o.x),
        (s.deltaY = o.y),
        (s.drag = a),
        (s.overlaps = d === h || d.contains(h)),
        { previousIndex: l, currentIndex: i }
      );
    }
    enter(t, n, r, o) {
      let i = this._activeItems.indexOf(t);
      i > -1 && this._activeItems.splice(i, 1);
      let s = o == null || o < 0 ? this._getItemIndexFromPointerPosition(t, n, r) : o;
      s === -1 && (s = this._getClosestItemIndexToPointer(t, n, r));
      let a = this._activeItems[s];
      a && !this._dragDropRegistry.isDragging(a)
        ? (this._activeItems.splice(s, 0, t), a.getRootElement().before(t.getPlaceholderElement()))
        : (this._activeItems.push(t), this._element.appendChild(t.getPlaceholderElement()));
    }
    withItems(t) {
      this._activeItems = t.slice();
    }
    withSortPredicate(t) {
      this._sortPredicate = t;
    }
    reset() {
      let t = this._element,
        n = this._previousSwap;
      for (let r = this._relatedNodes.length - 1; r > -1; r--) {
        let [o, i] = this._relatedNodes[r];
        o.parentNode === t &&
          o.nextSibling !== i &&
          (i === null ? t.appendChild(o) : i.parentNode === t && t.insertBefore(o, i));
      }
      ((this._relatedNodes = []),
        (this._activeItems = []),
        (n.drag = null),
        (n.deltaX = n.deltaY = 0),
        (n.overlaps = !1));
    }
    getActiveItemsSnapshot() {
      return this._activeItems;
    }
    getItemIndex(t) {
      return this._activeItems.indexOf(t);
    }
    getItemAtIndex(t) {
      return this._activeItems[t] || null;
    }
    updateOnScroll() {
      this._activeItems.forEach((t) => {
        this._dragDropRegistry.isDragging(t) && t._sortFromLastPointerPosition();
      });
    }
    withElementContainer(t) {
      t !== this._element && ((this._element = t), (this._rootNode = void 0));
    }
    _getItemIndexFromPointerPosition(t, n, r) {
      let o = this._getRootNode().elementFromPoint(Math.floor(n), Math.floor(r)),
        i = o
          ? this._activeItems.findIndex((s) => {
              let a = s.getRootElement();
              return o === a || a.contains(o);
            })
          : -1;
      return i === -1 || !this._sortPredicate(i, t) ? -1 : i;
    }
    _getRootNode() {
      return (
        this._rootNode || (this._rootNode = $l(this._element) || this._document),
        this._rootNode
      );
    }
    _getClosestItemIndexToPointer(t, n, r) {
      if (this._activeItems.length === 0) return -1;
      if (this._activeItems.length === 1) return 0;
      let o = 1 / 0,
        i = -1;
      for (let s = 0; s < this._activeItems.length; s++) {
        let a = this._activeItems[s];
        if (a !== t) {
          let { x: l, y: c } = a.getRootElement().getBoundingClientRect(),
            d = Math.hypot(n - l, r - c);
          d < o && ((o = d), (i = s));
        }
      }
      return i;
    }
  },
  Ov = 0.05,
  Bv = 0.05,
  kt = (function (e) {
    return ((e[(e.NONE = 0)] = 'NONE'), (e[(e.UP = 1)] = 'UP'), (e[(e.DOWN = 2)] = 'DOWN'), e);
  })(kt || {}),
  Ue = (function (e) {
    return (
      (e[(e.NONE = 0)] = 'NONE'),
      (e[(e.LEFT = 1)] = 'LEFT'),
      (e[(e.RIGHT = 2)] = 'RIGHT'),
      e
    );
  })(Ue || {}),
  Ep = class {
    _dragDropRegistry;
    _ngZone;
    _viewportRuler;
    element;
    disabled = !1;
    sortingDisabled = !1;
    lockAxis;
    autoScrollDisabled = !1;
    autoScrollStep = 2;
    hasAnchor = !1;
    enterPredicate = () => !0;
    sortPredicate = () => !0;
    beforeStarted = new P();
    entered = new P();
    exited = new P();
    dropped = new P();
    sorted = new P();
    receivingStarted = new P();
    receivingStopped = new P();
    data;
    _container;
    _isDragging = !1;
    _parentPositions;
    _sortStrategy;
    _domRect;
    _draggables = [];
    _siblings = [];
    _activeSiblings = new Set();
    _viewportScrollSubscription = J.EMPTY;
    _verticalScrollDirection = kt.NONE;
    _horizontalScrollDirection = Ue.NONE;
    _scrollNode;
    _stopScrollTimers = new P();
    _cachedShadowRoot = null;
    _document;
    _scrollableElements = [];
    _initialScrollSnap;
    _direction = 'ltr';
    constructor(t, n, r, o, i) {
      ((this._dragDropRegistry = n), (this._ngZone = o), (this._viewportRuler = i));
      let s = (this.element = Rt(t));
      ((this._document = r),
        this.withOrientation('vertical').withElementContainer(s),
        n.registerDropContainer(this),
        (this._parentPositions = new Zl(r)));
    }
    dispose() {
      (this._stopScrolling(),
        this._stopScrollTimers.complete(),
        this._viewportScrollSubscription.unsubscribe(),
        this.beforeStarted.complete(),
        this.entered.complete(),
        this.exited.complete(),
        this.dropped.complete(),
        this.sorted.complete(),
        this.receivingStarted.complete(),
        this.receivingStopped.complete(),
        this._activeSiblings.clear(),
        (this._scrollNode = null),
        this._parentPositions.clear(),
        this._dragDropRegistry.removeDropContainer(this));
    }
    isDragging() {
      return this._isDragging;
    }
    start() {
      (this._draggingStarted(), this._notifyReceivingSiblings());
    }
    enter(t, n, r, o) {
      (this._draggingStarted(),
        o == null && this.sortingDisabled && (o = this._draggables.indexOf(t)),
        this._sortStrategy.enter(t, n, r, o),
        this._cacheParentPositions(),
        this._notifyReceivingSiblings(),
        this.entered.next({ item: t, container: this, currentIndex: this.getItemIndex(t) }));
    }
    exit(t) {
      (this._reset(), this.exited.next({ item: t, container: this }));
    }
    drop(t, n, r, o, i, s, a, l = {}) {
      (this._reset(),
        this.dropped.next({
          item: t,
          currentIndex: n,
          previousIndex: r,
          container: this,
          previousContainer: o,
          isPointerOverContainer: i,
          distance: s,
          dropPoint: a,
          event: l,
        }));
    }
    withItems(t) {
      let n = this._draggables;
      return (
        (this._draggables = t),
        t.forEach((r) => r._withDropContainer(this)),
        this.isDragging() &&
          (n.filter((o) => o.isDragging()).every((o) => t.indexOf(o) === -1)
            ? this._reset()
            : this._sortStrategy.withItems(this._draggables)),
        this
      );
    }
    withDirection(t) {
      return (
        (this._direction = t),
        this._sortStrategy instanceof Kl && (this._sortStrategy.direction = t),
        this
      );
    }
    connectedTo(t) {
      return ((this._siblings = t.slice()), this);
    }
    withOrientation(t) {
      if (t === 'mixed') this._sortStrategy = new bp(this._document, this._dragDropRegistry);
      else {
        let n = new Kl(this._dragDropRegistry);
        ((n.direction = this._direction), (n.orientation = t), (this._sortStrategy = n));
      }
      return (
        this._sortStrategy.withElementContainer(this._container),
        this._sortStrategy.withSortPredicate((n, r) => this.sortPredicate(n, r, this)),
        this
      );
    }
    withScrollableParents(t) {
      let n = this._container;
      return ((this._scrollableElements = t.indexOf(n) === -1 ? [n, ...t] : t.slice()), this);
    }
    withElementContainer(t) {
      if (t === this._container) return this;
      let n = Rt(this.element),
        r = this._scrollableElements.indexOf(this._container),
        o = this._scrollableElements.indexOf(t);
      return (
        r > -1 && this._scrollableElements.splice(r, 1),
        o > -1 && this._scrollableElements.splice(o, 1),
        this._sortStrategy && this._sortStrategy.withElementContainer(t),
        (this._cachedShadowRoot = null),
        this._scrollableElements.unshift(t),
        (this._container = t),
        this
      );
    }
    getScrollableParents() {
      return this._scrollableElements;
    }
    getItemIndex(t) {
      return this._isDragging ? this._sortStrategy.getItemIndex(t) : this._draggables.indexOf(t);
    }
    getItemAtIndex(t) {
      return this._isDragging ? this._sortStrategy.getItemAtIndex(t) : this._draggables[t] || null;
    }
    isReceiving() {
      return this._activeSiblings.size > 0;
    }
    _sortItem(t, n, r, o) {
      if (this.sortingDisabled || !this._domRect || !Cv(this._domRect, Ov, n, r)) return;
      let i = this._sortStrategy.sort(t, n, r, o);
      i &&
        this.sorted.next({
          previousIndex: i.previousIndex,
          currentIndex: i.currentIndex,
          container: this,
          item: t,
        });
    }
    _startScrollingIfNecessary(t, n) {
      if (this.autoScrollDisabled) return;
      let r,
        o = kt.NONE,
        i = Ue.NONE;
      if (
        (this._parentPositions.positions.forEach((s, a) => {
          a === this._document ||
            !s.clientRect ||
            r ||
            (Cv(s.clientRect, Ov, t, n) &&
              (([o, i] = Z5(a, s.clientRect, this._direction, t, n)), (o || i) && (r = a)));
        }),
        !o && !i)
      ) {
        let { width: s, height: a } = this._viewportRuler.getViewportSize(),
          l = { width: s, height: a, top: 0, right: s, bottom: a, left: 0 };
        ((o = Lv(l, n)), (i = Fv(l, t)), (r = window));
      }
      r &&
        (o !== this._verticalScrollDirection ||
          i !== this._horizontalScrollDirection ||
          r !== this._scrollNode) &&
        ((this._verticalScrollDirection = o),
        (this._horizontalScrollDirection = i),
        (this._scrollNode = r),
        (o || i) && r
          ? this._ngZone.runOutsideAngular(this._startScrollInterval)
          : this._stopScrolling());
    }
    _stopScrolling() {
      this._stopScrollTimers.next();
    }
    _draggingStarted() {
      let t = this._container.style;
      (this.beforeStarted.next(),
        (this._isDragging = !0),
        (this._initialScrollSnap = t.msScrollSnapType || t.scrollSnapType || ''),
        (t.scrollSnapType = t.msScrollSnapType = 'none'),
        this._sortStrategy.start(this._draggables),
        this._cacheParentPositions(),
        this._viewportScrollSubscription.unsubscribe(),
        this._listenToScrollEvents());
    }
    _cacheParentPositions() {
      (this._parentPositions.cache(this._scrollableElements),
        (this._domRect = this._parentPositions.positions.get(this._container).clientRect));
    }
    _reset() {
      this._isDragging = !1;
      let t = this._container.style;
      ((t.scrollSnapType = t.msScrollSnapType = this._initialScrollSnap),
        this._siblings.forEach((n) => n._stopReceiving(this)),
        this._sortStrategy.reset(),
        this._stopScrolling(),
        this._viewportScrollSubscription.unsubscribe(),
        this._parentPositions.clear());
    }
    _startScrollInterval = () => {
      (this._stopScrolling(),
        zc(0, Ls)
          .pipe(Lt(this._stopScrollTimers))
          .subscribe(() => {
            let t = this._scrollNode,
              n = this.autoScrollStep;
            (this._verticalScrollDirection === kt.UP
              ? t.scrollBy(0, -n)
              : this._verticalScrollDirection === kt.DOWN && t.scrollBy(0, n),
              this._horizontalScrollDirection === Ue.LEFT
                ? t.scrollBy(-n, 0)
                : this._horizontalScrollDirection === Ue.RIGHT && t.scrollBy(n, 0));
          }));
    };
    _isOverContainer(t, n) {
      return this._domRect != null && Mp(this._domRect, t, n);
    }
    _getSiblingContainerFromPosition(t, n, r) {
      return this._siblings.find((o) => o._canReceive(t, n, r));
    }
    _canReceive(t, n, r) {
      if (!this._domRect || !Mp(this._domRect, n, r) || !this.enterPredicate(t, this)) return !1;
      let o = this._getShadowRoot().elementFromPoint(n, r);
      return o ? o === this._container || this._container.contains(o) : !1;
    }
    _startReceiving(t, n) {
      let r = this._activeSiblings;
      !r.has(t) &&
        n.every((o) => this.enterPredicate(o, this) || this._draggables.indexOf(o) > -1) &&
        (r.add(t),
        this._cacheParentPositions(),
        this._listenToScrollEvents(),
        this.receivingStarted.next({ initiator: t, receiver: this, items: n }));
    }
    _stopReceiving(t) {
      (this._activeSiblings.delete(t),
        this._viewportScrollSubscription.unsubscribe(),
        this.receivingStopped.next({ initiator: t, receiver: this }));
    }
    _listenToScrollEvents() {
      this._viewportScrollSubscription = this._dragDropRegistry
        .scrolled(this._getShadowRoot())
        .subscribe((t) => {
          if (this.isDragging()) {
            let n = this._parentPositions.handleScroll(t);
            n && this._sortStrategy.updateOnScroll(n.top, n.left);
          } else this.isReceiving() && this._cacheParentPositions();
        });
    }
    _getShadowRoot() {
      if (!this._cachedShadowRoot) {
        let t = $l(this._container);
        this._cachedShadowRoot = t || this._document;
      }
      return this._cachedShadowRoot;
    }
    _notifyReceivingSiblings() {
      let t = this._sortStrategy.getActiveItemsSnapshot().filter((n) => n.isDragging());
      this._siblings.forEach((n) => n._startReceiving(this, t));
    }
  };
function Lv(e, t) {
  let { top: n, bottom: r, height: o } = e,
    i = o * Bv;
  return t >= n - i && t <= n + i ? kt.UP : t >= r - i && t <= r + i ? kt.DOWN : kt.NONE;
}
function Fv(e, t) {
  let { left: n, right: r, width: o } = e,
    i = o * Bv;
  return t >= n - i && t <= n + i ? Ue.LEFT : t >= r - i && t <= r + i ? Ue.RIGHT : Ue.NONE;
}
function Z5(e, t, n, r, o) {
  let i = Lv(t, o),
    s = Fv(t, r),
    a = kt.NONE,
    l = Ue.NONE;
  if (i) {
    let c = e.scrollTop;
    i === kt.UP ? c > 0 && (a = kt.UP) : e.scrollHeight - c > e.clientHeight && (a = kt.DOWN);
  }
  if (s) {
    let c = e.scrollLeft;
    n === 'rtl'
      ? s === Ue.RIGHT
        ? c < 0 && (l = Ue.RIGHT)
        : e.scrollWidth + c > e.clientWidth && (l = Ue.LEFT)
      : s === Ue.LEFT
        ? c > 0 && (l = Ue.LEFT)
        : e.scrollWidth - c > e.clientWidth && (l = Ue.RIGHT);
  }
  return [a, l];
}
var os = { capture: !0 },
  _p = { passive: !1, capture: !0 },
  Y5 = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵcmp = se({
        type: e,
        selectors: [['ng-component']],
        hostAttrs: ['cdk-drag-resets-container', ''],
        decls: 0,
        vars: 0,
        template: function (r, o) {},
        styles: [
          `@layer cdk-resets{.cdk-drag-preview{background:none;border:none;padding:0;color:inherit;inset:auto}}.cdk-drag-placeholder *,.cdk-drag-preview *{pointer-events:none !important}
`,
        ],
        encapsulation: 2,
        changeDetection: 0,
      });
    }
    return e;
  })(),
  Rp = (() => {
    class e {
      _ngZone = u(X);
      _document = u(de);
      _styleLoader = u(gv);
      _renderer = u(Je).createRenderer(null, null);
      _cleanupDocumentTouchmove;
      _scroll = new P();
      _dropInstances = new Set();
      _dragInstances = new Set();
      _activeDragInstances = W([]);
      _globalListeners;
      _draggingPredicate = (n) => n.isDragging();
      _domNodesToDirectives = null;
      pointerMove = new P();
      pointerUp = new P();
      constructor() {}
      registerDropContainer(n) {
        this._dropInstances.has(n) || this._dropInstances.add(n);
      }
      registerDragItem(n) {
        (this._dragInstances.add(n),
          this._dragInstances.size === 1 &&
            this._ngZone.runOutsideAngular(() => {
              (this._cleanupDocumentTouchmove?.(),
                (this._cleanupDocumentTouchmove = this._renderer.listen(
                  this._document,
                  'touchmove',
                  this._persistentTouchmoveListener,
                  _p,
                )));
            }));
      }
      removeDropContainer(n) {
        this._dropInstances.delete(n);
      }
      removeDragItem(n) {
        (this._dragInstances.delete(n),
          this.stopDragging(n),
          this._dragInstances.size === 0 && this._cleanupDocumentTouchmove?.());
      }
      startDragging(n, r) {
        if (
          !(this._activeDragInstances().indexOf(n) > -1) &&
          (this._styleLoader.load(Y5),
          this._activeDragInstances.update((o) => [...o, n]),
          this._activeDragInstances().length === 1)
        ) {
          let o = r.type.startsWith('touch'),
            i = (a) => this.pointerUp.next(a),
            s = [
              ['scroll', (a) => this._scroll.next(a), os],
              ['selectstart', this._preventDefaultWhileDragging, _p],
            ];
          (o ? s.push(['touchend', i, os], ['touchcancel', i, os]) : s.push(['mouseup', i, os]),
            o || s.push(['mousemove', (a) => this.pointerMove.next(a), _p]),
            this._ngZone.runOutsideAngular(() => {
              this._globalListeners = s.map(([a, l, c]) =>
                this._renderer.listen(this._document, a, l, c),
              );
            }));
        }
      }
      stopDragging(n) {
        (this._activeDragInstances.update((r) => {
          let o = r.indexOf(n);
          return o > -1 ? (r.splice(o, 1), [...r]) : r;
        }),
          this._activeDragInstances().length === 0 && this._clearGlobalListeners());
      }
      isDragging(n) {
        return this._activeDragInstances().indexOf(n) > -1;
      }
      scrolled(n) {
        let r = [this._scroll];
        return (
          n &&
            n !== this._document &&
            r.push(
              new U((o) =>
                this._ngZone.runOutsideAngular(() => {
                  let i = this._renderer.listen(
                    n,
                    'scroll',
                    (s) => {
                      this._activeDragInstances().length && o.next(s);
                    },
                    os,
                  );
                  return () => {
                    i();
                  };
                }),
              ),
            ),
          Wo(...r)
        );
      }
      registerDirectiveNode(n, r) {
        ((this._domNodesToDirectives ??= new WeakMap()), this._domNodesToDirectives.set(n, r));
      }
      removeDirectiveNode(n) {
        this._domNodesToDirectives?.delete(n);
      }
      getDragDirectiveForNode(n) {
        return this._domNodesToDirectives?.get(n) || null;
      }
      ngOnDestroy() {
        (this._dragInstances.forEach((n) => this.removeDragItem(n)),
          this._dropInstances.forEach((n) => this.removeDropContainer(n)),
          (this._domNodesToDirectives = null),
          this._clearGlobalListeners(),
          this.pointerMove.complete(),
          this.pointerUp.complete());
      }
      _preventDefaultWhileDragging = (n) => {
        this._activeDragInstances().length > 0 && n.preventDefault();
      };
      _persistentTouchmoveListener = (n) => {
        this._activeDragInstances().length > 0 &&
          (this._activeDragInstances().some(this._draggingPredicate) && n.preventDefault(),
          this.pointerMove.next(n));
      };
      _clearGlobalListeners() {
        (this._globalListeners?.forEach((n) => n()), (this._globalListeners = void 0));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  K5 = { dragStartThreshold: 5, pointerDirectionChangeThreshold: 5 },
  Vv = (() => {
    class e {
      _document = u(de);
      _ngZone = u(X);
      _viewportRuler = u(wv);
      _dragDropRegistry = u(Rp);
      _renderer = u(Je).createRenderer(null, null);
      constructor() {}
      createDrag(n, r = K5) {
        return new Dp(
          n,
          r,
          this._document,
          this._ngZone,
          this._viewportRuler,
          this._dragDropRegistry,
          this._renderer,
        );
      }
      createDropList(n) {
        return new Ep(n, this._dragDropRegistry, this._document, this._ngZone, this._viewportRuler);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  Sp = new _('CDK_DRAG_PARENT');
var Hv = new _('CdkDragHandle'),
  Uv = (() => {
    class e {
      element = u(ge);
      _parentDrag = u(Sp, { optional: !0, skipSelf: !0 });
      _dragDropRegistry = u(Rp);
      _stateChanges = new P();
      get disabled() {
        return this._disabled;
      }
      set disabled(n) {
        ((this._disabled = n), this._stateChanges.next(this));
      }
      _disabled = !1;
      constructor() {
        this._parentDrag?._addHandle(this);
      }
      ngAfterViewInit() {
        if (!this._parentDrag) {
          let n = this.element.nativeElement.parentElement;
          for (; n; ) {
            let r = this._dragDropRegistry.getDragDirectiveForNode(n);
            if (r) {
              ((this._parentDrag = r), r._addHandle(this));
              break;
            }
            n = n.parentElement;
          }
        }
      }
      ngOnDestroy() {
        (this._parentDrag?._removeHandle(this), this._stateChanges.complete());
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'cdkDragHandle', '']],
        hostAttrs: [1, 'cdk-drag-handle'],
        inputs: { disabled: [2, 'cdkDragHandleDisabled', 'disabled', et] },
        features: [qe([{ provide: Hv, useExisting: e }])],
      });
    }
    return e;
  })(),
  zv = new _('CDK_DRAG_CONFIG'),
  $v = new _('CdkDropList'),
  Ql = (() => {
    class e {
      element = u(ge);
      dropContainer = u($v, { optional: !0, skipSelf: !0 });
      _ngZone = u(X);
      _viewContainerRef = u(gt);
      _dir = u(ns, { optional: !0 });
      _changeDetectorRef = u(wt);
      _selfHandle = u(Hv, { optional: !0, self: !0 });
      _parentDrag = u(Sp, { optional: !0, skipSelf: !0 });
      _dragDropRegistry = u(Rp);
      _destroyed = new P();
      _handles = new we([]);
      _previewTemplate;
      _placeholderTemplate;
      _dragRef;
      data;
      lockAxis;
      rootElementSelector;
      boundaryElement;
      dragStartDelay;
      freeDragPosition;
      get disabled() {
        return this._disabled || !!(this.dropContainer && this.dropContainer.disabled);
      }
      set disabled(n) {
        ((this._disabled = n), (this._dragRef.disabled = this._disabled));
      }
      _disabled;
      constrainPosition;
      previewClass;
      previewContainer;
      scale = 1;
      started = new T();
      released = new T();
      ended = new T();
      entered = new T();
      exited = new T();
      dropped = new T();
      moved = new U((n) => {
        let r = this._dragRef.moved
          .pipe(
            G((o) => ({
              source: this,
              pointerPosition: o.pointerPosition,
              event: o.event,
              delta: o.delta,
              distance: o.distance,
            })),
          )
          .subscribe(n);
        return () => {
          r.unsubscribe();
        };
      });
      _injector = u(pe);
      constructor() {
        let n = this.dropContainer,
          r = u(zv, { optional: !0 }),
          o = u(Vv);
        ((this._dragRef = o.createDrag(this.element, {
          dragStartThreshold: r && r.dragStartThreshold != null ? r.dragStartThreshold : 5,
          pointerDirectionChangeThreshold:
            r && r.pointerDirectionChangeThreshold != null ? r.pointerDirectionChangeThreshold : 5,
          zIndex: r?.zIndex,
        })),
          (this._dragRef.data = this),
          this._dragDropRegistry.registerDirectiveNode(this.element.nativeElement, this),
          r && this._assignDefaults(r),
          n &&
            (n.addItem(this),
            n._dropListRef.beforeStarted.pipe(Lt(this._destroyed)).subscribe(() => {
              this._dragRef.scale = this.scale;
            })),
          this._syncInputs(this._dragRef),
          this._handleEvents(this._dragRef));
      }
      getPlaceholderElement() {
        return this._dragRef.getPlaceholderElement();
      }
      getRootElement() {
        return this._dragRef.getRootElement();
      }
      reset() {
        this._dragRef.reset();
      }
      resetToBoundary() {
        this._dragRef.resetToBoundary();
      }
      getFreeDragPosition() {
        return this._dragRef.getFreeDragPosition();
      }
      setFreeDragPosition(n) {
        this._dragRef.setFreeDragPosition(n);
      }
      ngAfterViewInit() {
        vr(
          () => {
            (this._updateRootElement(),
              this._setupHandlesListener(),
              (this._dragRef.scale = this.scale),
              this.freeDragPosition && this._dragRef.setFreeDragPosition(this.freeDragPosition));
          },
          { injector: this._injector },
        );
      }
      ngOnChanges(n) {
        let r = n.rootElementSelector,
          o = n.freeDragPosition;
        (r && !r.firstChange && this._updateRootElement(),
          (this._dragRef.scale = this.scale),
          o &&
            !o.firstChange &&
            this.freeDragPosition &&
            this._dragRef.setFreeDragPosition(this.freeDragPosition));
      }
      ngOnDestroy() {
        (this.dropContainer && this.dropContainer.removeItem(this),
          this._dragDropRegistry.removeDirectiveNode(this.element.nativeElement),
          this._ngZone.runOutsideAngular(() => {
            (this._handles.complete(),
              this._destroyed.next(),
              this._destroyed.complete(),
              this._dragRef.dispose());
          }));
      }
      _addHandle(n) {
        let r = this._handles.getValue();
        (r.push(n), this._handles.next(r));
      }
      _removeHandle(n) {
        let r = this._handles.getValue(),
          o = r.indexOf(n);
        o > -1 && (r.splice(o, 1), this._handles.next(r));
      }
      _setPreviewTemplate(n) {
        this._previewTemplate = n;
      }
      _resetPreviewTemplate(n) {
        n === this._previewTemplate && (this._previewTemplate = null);
      }
      _setPlaceholderTemplate(n) {
        this._placeholderTemplate = n;
      }
      _resetPlaceholderTemplate(n) {
        n === this._placeholderTemplate && (this._placeholderTemplate = null);
      }
      _updateRootElement() {
        let n = this.element.nativeElement,
          r = n;
        (this.rootElementSelector &&
          (r =
            n.closest !== void 0
              ? n.closest(this.rootElementSelector)
              : n.parentElement?.closest(this.rootElementSelector)),
          this._dragRef.withRootElement(r || n));
      }
      _getBoundaryElement() {
        let n = this.boundaryElement;
        return n ? (typeof n == 'string' ? this.element.nativeElement.closest(n) : Rt(n)) : null;
      }
      _syncInputs(n) {
        (n.beforeStarted.subscribe(() => {
          if (!n.isDragging()) {
            let r = this._dir,
              o = this.dragStartDelay,
              i = this._placeholderTemplate
                ? {
                    template: this._placeholderTemplate.templateRef,
                    context: this._placeholderTemplate.data,
                    viewContainer: this._viewContainerRef,
                  }
                : null,
              s = this._previewTemplate
                ? {
                    template: this._previewTemplate.templateRef,
                    context: this._previewTemplate.data,
                    matchSize: this._previewTemplate.matchSize,
                    viewContainer: this._viewContainerRef,
                  }
                : null;
            ((n.disabled = this.disabled),
              (n.lockAxis = this.lockAxis),
              (n.scale = this.scale),
              (n.dragStartDelay = typeof o == 'object' && o ? o : Gl(o)),
              (n.constrainPosition = this.constrainPosition),
              (n.previewClass = this.previewClass),
              n
                .withBoundaryElement(this._getBoundaryElement())
                .withPlaceholderTemplate(i)
                .withPreviewTemplate(s)
                .withPreviewContainer(this.previewContainer || 'global'),
              r && n.withDirection(r.value));
          }
        }),
          n.beforeStarted.pipe(_t(1)).subscribe(() => {
            if (this._parentDrag) {
              n.withParent(this._parentDrag._dragRef);
              return;
            }
            let r = this.element.nativeElement.parentElement;
            for (; r; ) {
              let o = this._dragDropRegistry.getDragDirectiveForNode(r);
              if (o) {
                n.withParent(o._dragRef);
                break;
              }
              r = r.parentElement;
            }
          }));
      }
      _handleEvents(n) {
        (n.started.subscribe((r) => {
          (this.started.emit({ source: this, event: r.event }),
            this._changeDetectorRef.markForCheck());
        }),
          n.released.subscribe((r) => {
            this.released.emit({ source: this, event: r.event });
          }),
          n.ended.subscribe((r) => {
            (this.ended.emit({
              source: this,
              distance: r.distance,
              dropPoint: r.dropPoint,
              event: r.event,
            }),
              this._changeDetectorRef.markForCheck());
          }),
          n.entered.subscribe((r) => {
            this.entered.emit({
              container: r.container.data,
              item: this,
              currentIndex: r.currentIndex,
            });
          }),
          n.exited.subscribe((r) => {
            this.exited.emit({ container: r.container.data, item: this });
          }),
          n.dropped.subscribe((r) => {
            this.dropped.emit({
              previousIndex: r.previousIndex,
              currentIndex: r.currentIndex,
              previousContainer: r.previousContainer.data,
              container: r.container.data,
              isPointerOverContainer: r.isPointerOverContainer,
              item: this,
              distance: r.distance,
              dropPoint: r.dropPoint,
              event: r.event,
            });
          }));
      }
      _assignDefaults(n) {
        let {
          lockAxis: r,
          dragStartDelay: o,
          constrainPosition: i,
          previewClass: s,
          boundaryElement: a,
          draggingDisabled: l,
          rootElementSelector: c,
          previewContainer: d,
        } = n;
        ((this.disabled = l ?? !1),
          (this.dragStartDelay = o || 0),
          r && (this.lockAxis = r),
          i && (this.constrainPosition = i),
          s && (this.previewClass = s),
          a && (this.boundaryElement = a),
          c && (this.rootElementSelector = c),
          d && (this.previewContainer = d));
      }
      _setupHandlesListener() {
        this._handles
          .pipe(
            fe((n) => {
              let r = n.map((o) => o.element);
              (this._selfHandle && this.rootElementSelector && r.push(this.element),
                this._dragRef.withHandles(r));
            }),
            be((n) => Wo(...n.map((r) => r._stateChanges.pipe(Zn(r))))),
            Lt(this._destroyed),
          )
          .subscribe((n) => {
            let r = this._dragRef,
              o = n.element.nativeElement;
            n.disabled ? r.disableHandle(o) : r.enableHandle(o);
          });
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'cdkDrag', '']],
        hostAttrs: [1, 'cdk-drag'],
        hostVars: 4,
        hostBindings: function (r, o) {
          r & 2 &&
            ie('cdk-drag-disabled', o.disabled)('cdk-drag-dragging', o._dragRef.isDragging());
        },
        inputs: {
          data: [0, 'cdkDragData', 'data'],
          lockAxis: [0, 'cdkDragLockAxis', 'lockAxis'],
          rootElementSelector: [0, 'cdkDragRootElement', 'rootElementSelector'],
          boundaryElement: [0, 'cdkDragBoundary', 'boundaryElement'],
          dragStartDelay: [0, 'cdkDragStartDelay', 'dragStartDelay'],
          freeDragPosition: [0, 'cdkDragFreeDragPosition', 'freeDragPosition'],
          disabled: [2, 'cdkDragDisabled', 'disabled', et],
          constrainPosition: [0, 'cdkDragConstrainPosition', 'constrainPosition'],
          previewClass: [0, 'cdkDragPreviewClass', 'previewClass'],
          previewContainer: [0, 'cdkDragPreviewContainer', 'previewContainer'],
          scale: [2, 'cdkDragScale', 'scale', Du],
        },
        outputs: {
          started: 'cdkDragStarted',
          released: 'cdkDragReleased',
          ended: 'cdkDragEnded',
          entered: 'cdkDragEntered',
          exited: 'cdkDragExited',
          dropped: 'cdkDragDropped',
          moved: 'cdkDragMoved',
        },
        exportAs: ['cdkDrag'],
        features: [qe([{ provide: Sp, useExisting: e }]), Et],
      });
    }
    return e;
  })(),
  Ip = new _('CdkDropListGroup'),
  Gv = (() => {
    class e {
      _items = new Set();
      disabled = !1;
      ngOnDestroy() {
        this._items.clear();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'cdkDropListGroup', '']],
        inputs: { disabled: [2, 'cdkDropListGroupDisabled', 'disabled', et] },
        exportAs: ['cdkDropListGroup'],
        features: [qe([{ provide: Ip, useExisting: e }])],
      });
    }
    return e;
  })(),
  Pp = (() => {
    class e {
      element = u(ge);
      _changeDetectorRef = u(wt);
      _scrollDispatcher = u(mp);
      _dir = u(ns, { optional: !0 });
      _group = u(Ip, { optional: !0, skipSelf: !0 });
      _latestSortedRefs;
      _destroyed = new P();
      _scrollableParentsResolved;
      static _dropLists = [];
      _dropListRef;
      connectedTo = [];
      data;
      orientation;
      id = u(kv).getId('cdk-drop-list-');
      lockAxis;
      get disabled() {
        return this._disabled || (!!this._group && this._group.disabled);
      }
      set disabled(n) {
        this._dropListRef.disabled = this._disabled = n;
      }
      _disabled;
      sortingDisabled;
      enterPredicate = () => !0;
      sortPredicate = () => !0;
      autoScrollDisabled;
      autoScrollStep;
      elementContainerSelector;
      hasAnchor;
      dropped = new T();
      entered = new T();
      exited = new T();
      sorted = new T();
      _unsortedItems = new Set();
      constructor() {
        let n = u(Vv),
          r = u(zv, { optional: !0 });
        ((this._dropListRef = n.createDropList(this.element)),
          (this._dropListRef.data = this),
          r && this._assignDefaults(r),
          (this._dropListRef.enterPredicate = (o, i) => this.enterPredicate(o.data, i.data)),
          (this._dropListRef.sortPredicate = (o, i, s) => this.sortPredicate(o, i.data, s.data)),
          this._setupInputSyncSubscription(this._dropListRef),
          this._handleEvents(this._dropListRef),
          e._dropLists.push(this),
          this._group && this._group._items.add(this));
      }
      addItem(n) {
        (this._unsortedItems.add(n),
          n._dragRef._withDropContainer(this._dropListRef),
          this._dropListRef.isDragging() &&
            this._syncItemsWithRef(this.getSortedItems().map((r) => r._dragRef)));
      }
      removeItem(n) {
        if ((this._unsortedItems.delete(n), this._latestSortedRefs)) {
          let r = this._latestSortedRefs.indexOf(n._dragRef);
          r > -1 &&
            (this._latestSortedRefs.splice(r, 1), this._syncItemsWithRef(this._latestSortedRefs));
        }
      }
      getSortedItems() {
        return Array.from(this._unsortedItems).sort((n, r) =>
          n._dragRef.getVisibleElement().compareDocumentPosition(r._dragRef.getVisibleElement()) &
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        );
      }
      ngOnDestroy() {
        let n = e._dropLists.indexOf(this);
        (n > -1 && e._dropLists.splice(n, 1),
          this._group && this._group._items.delete(this),
          (this._latestSortedRefs = void 0),
          this._unsortedItems.clear(),
          this._dropListRef.dispose(),
          this._destroyed.next(),
          this._destroyed.complete());
      }
      _setupInputSyncSubscription(n) {
        (this._dir &&
          this._dir.change
            .pipe(Zn(this._dir.value), Lt(this._destroyed))
            .subscribe((r) => n.withDirection(r)),
          n.beforeStarted.subscribe(() => {
            let r = yv(this.connectedTo).map((o) => {
              if (typeof o == 'string') {
                let i = e._dropLists.find((s) => s.id === o);
                return i;
              }
              return o;
            });
            if (
              (this._group &&
                this._group._items.forEach((o) => {
                  r.indexOf(o) === -1 && r.push(o);
                }),
              !this._scrollableParentsResolved)
            ) {
              let o = this._scrollDispatcher
                .getAncestorScrollContainers(this.element)
                .map((i) => i.getElementRef().nativeElement);
              (this._dropListRef.withScrollableParents(o), (this._scrollableParentsResolved = !0));
            }
            if (this.elementContainerSelector) {
              let o = this.element.nativeElement.querySelector(this.elementContainerSelector);
              n.withElementContainer(o);
            }
            ((n.disabled = this.disabled),
              (n.lockAxis = this.lockAxis),
              (n.sortingDisabled = this.sortingDisabled),
              (n.autoScrollDisabled = this.autoScrollDisabled),
              (n.autoScrollStep = Gl(this.autoScrollStep, 2)),
              (n.hasAnchor = this.hasAnchor),
              n
                .connectedTo(r.filter((o) => o && o !== this).map((o) => o._dropListRef))
                .withOrientation(this.orientation));
          }));
      }
      _handleEvents(n) {
        (n.beforeStarted.subscribe(() => {
          (this._syncItemsWithRef(this.getSortedItems().map((r) => r._dragRef)),
            this._changeDetectorRef.markForCheck());
        }),
          n.entered.subscribe((r) => {
            this.entered.emit({ container: this, item: r.item.data, currentIndex: r.currentIndex });
          }),
          n.exited.subscribe((r) => {
            (this.exited.emit({ container: this, item: r.item.data }),
              this._changeDetectorRef.markForCheck());
          }),
          n.sorted.subscribe((r) => {
            this.sorted.emit({
              previousIndex: r.previousIndex,
              currentIndex: r.currentIndex,
              container: this,
              item: r.item.data,
            });
          }),
          n.dropped.subscribe((r) => {
            (this.dropped.emit({
              previousIndex: r.previousIndex,
              currentIndex: r.currentIndex,
              previousContainer: r.previousContainer.data,
              container: r.container.data,
              item: r.item.data,
              isPointerOverContainer: r.isPointerOverContainer,
              distance: r.distance,
              dropPoint: r.dropPoint,
              event: r.event,
            }),
              this._changeDetectorRef.markForCheck());
          }),
          Wo(n.receivingStarted, n.receivingStopped).subscribe(() =>
            this._changeDetectorRef.markForCheck(),
          ));
      }
      _assignDefaults(n) {
        let {
          lockAxis: r,
          draggingDisabled: o,
          sortingDisabled: i,
          listAutoScrollDisabled: s,
          listOrientation: a,
        } = n;
        ((this.disabled = o ?? !1),
          (this.sortingDisabled = i ?? !1),
          (this.autoScrollDisabled = s ?? !1),
          (this.orientation = a || 'vertical'),
          r && (this.lockAxis = r));
      }
      _syncItemsWithRef(n) {
        ((this._latestSortedRefs = n), this._dropListRef.withItems(n));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'cdkDropList', ''], ['cdk-drop-list']],
        hostAttrs: [1, 'cdk-drop-list'],
        hostVars: 7,
        hostBindings: function (r, o) {
          r & 2 &&
            (Ne('id', o.id),
            ie('cdk-drop-list-disabled', o.disabled)(
              'cdk-drop-list-dragging',
              o._dropListRef.isDragging(),
            )('cdk-drop-list-receiving', o._dropListRef.isReceiving()));
        },
        inputs: {
          connectedTo: [0, 'cdkDropListConnectedTo', 'connectedTo'],
          data: [0, 'cdkDropListData', 'data'],
          orientation: [0, 'cdkDropListOrientation', 'orientation'],
          id: 'id',
          lockAxis: [0, 'cdkDropListLockAxis', 'lockAxis'],
          disabled: [2, 'cdkDropListDisabled', 'disabled', et],
          sortingDisabled: [2, 'cdkDropListSortingDisabled', 'sortingDisabled', et],
          enterPredicate: [0, 'cdkDropListEnterPredicate', 'enterPredicate'],
          sortPredicate: [0, 'cdkDropListSortPredicate', 'sortPredicate'],
          autoScrollDisabled: [2, 'cdkDropListAutoScrollDisabled', 'autoScrollDisabled', et],
          autoScrollStep: [0, 'cdkDropListAutoScrollStep', 'autoScrollStep'],
          elementContainerSelector: [0, 'cdkDropListElementContainer', 'elementContainerSelector'],
          hasAnchor: [2, 'cdkDropListHasAnchor', 'hasAnchor', et],
        },
        outputs: {
          dropped: 'cdkDropListDropped',
          entered: 'cdkDropListEntered',
          exited: 'cdkDropListExited',
          sorted: 'cdkDropListSorted',
        },
        exportAs: ['cdkDropList'],
        features: [
          qe([
            { provide: Ip, useValue: void 0 },
            { provide: $v, useExisting: e },
          ]),
        ],
      });
    }
    return e;
  })();
var Ao = { 2: 'Seg', 3: 'Ter', 4: 'Qua', 5: 'Qui', 6: 'Sex', 7: 'S\xE1b' };
var rt = (e, t) =>
    e === 'M'
      ? [7 + (t - 1), 8 + (t - 1)]
      : e === 'T'
        ? [12 + (t - 1), 13 + (t - 1)]
        : [18 + (t - 1), 19 + (t - 1)],
  qv = (e) => (e === 'T' ? 6 : 5),
  Ot = (e) => String(e).padStart(2, '0') + ':00';
var Xl = class e {
  prefix = 'sched:';
  has = (t) => localStorage.getItem(this.prefix + t) !== null;
  get = (t, n) => {
    let r = localStorage.getItem(this.prefix + t);
    if (!r) return n;
    try {
      return JSON.parse(r);
    } catch {
      return n;
    }
  };
  set = (t, n) => localStorage.setItem(this.prefix + t, JSON.stringify(n));
  del = (t) => localStorage.removeItem(this.prefix + t);
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
};
var We = class e {
    constructor(t) {
      this.ls = t;
    }
    key = 'schedule:v1';
    courses = W([]);
    types = W([
      { id: 'obg', label: 'Obrigat\xF3ria', color: '#22d3ee' },
      { id: 'elt', label: 'Eletiva', color: '#f97316' },
      { id: 'opt', label: 'Optativa', color: '#84cc16' },
      { id: 'cpl', label: 'Complementar', color: '#a78bfa' },
      { id: 'ext', label: 'Extens\xE3o', color: '#34d399' },
      { id: 'mon', label: 'Monitoria', color: '#f59e0b' },
      { id: 'out', label: 'Outro', color: '#e879f9' },
    ]);
    hydrate() {
      let t = this.ls.get(this.key, { courses: [], types: this.types() });
      return (this.courses.set(t.courses), this.types.set(t.types), Promise.resolve(!0));
    }
    persist() {
      this.ls.set(this.key, { courses: this.courses(), types: this.types() });
    }
    upsertCourse(t) {
      let n = this.courses(),
        r = n.findIndex((i) => i.id === t.id),
        o = r >= 0 ? [...n.slice(0, r), t, ...n.slice(r + 1)] : [...n, t];
      (this.courses.set(o), this.persist());
    }
    removeCourse(t) {
      let n = this.courses();
      (this.courses.set(n.filter((r) => r.id !== t)), this.persist());
    }
    addType(t, n) {
      let r = { id: crypto.randomUUID(), label: t, color: n };
      return (this.types.update((o) => [...o, r]), this.persist(), r);
    }
    usedSlots = ue(() => {
      let t = new Map();
      for (let n of this.courses())
        for (let r of n.meetings) {
          let o = r.day + r.period;
          (t.has(o) || t.set(o, new Set()), r.slots.forEach((i) => t.get(o).add(i)));
        }
      return t;
    });
    allHoursCompact = ue(() => {
      let t = new Set();
      for (let n of this.courses())
        for (let r of n.meetings) r.slots.forEach((o) => t.add(X5(r.period, o)));
      return Array.from(t).sort((n, r) => n - r);
    });
    static ɵfac = function (n) {
      return new (n || e)(O(Xl));
    };
    static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
  },
  X5 = (e, t) => (e === 'M' ? t : e === 'T' ? 5 + t : 11 + t);
function J5(e, t) {
  if ((e & 1 && (f(0, 'div', 8), M(1), v()), e & 2)) {
    let n = k(2);
    (m(), he(n.typeLabel()));
  }
}
function eC(e, t) {
  if (e & 1) {
    let n = _e();
    (f(0, 'div', 1),
      S('cdkDragStarted', function () {
        C(n);
        let o = k();
        return D(o.onDragStarted());
      })('cdkDragEnded', function () {
        C(n);
        let o = k();
        return D(o.onDragEnded());
      })('click', function () {
        C(n);
        let o = k();
        return D(o.onCardActivate());
      })('keydown.enter', function () {
        C(n);
        let o = k();
        return D(o.onCardActivate());
      })('keydown.space', function () {
        C(n);
        let o = k();
        return D(o.onCardActivate());
      }),
      E(1, 'div', 2),
      f(2, 'div', 3)(3, 'div', 4),
      M(4),
      v(),
      f(5, 'button', 5),
      S('click', function (o) {
        return (C(n), D(o.stopPropagation()));
      }),
      E(6, 'ng-icon', 6),
      v()(),
      Q(7, J5, 2, 1, 'div', 7),
      v());
  }
  if (e & 2) {
    let n = k();
    (Tt('--type', n.typeColor),
      A('cdkDragData', n.dragData),
      m(3),
      A('title', n.course.name),
      m(),
      he(n.course.name),
      m(3),
      A('ngIf', n.typeLabel()));
  }
}
var Jl = class e {
  course;
  day;
  hour;
  dragStart = new T();
  dragEnd = new T();
  openShare = new T();
  dragging = !1;
  get visible() {
    return tC(this.course, this.day, this.hour);
  }
  get typeColor() {
    return this.store.types().find((n) => n.id === this.course.typeId)?.color ?? 'var(--primary)';
  }
  get dragData() {
    for (let t of this.course.meetings)
      if (t.day === this.day)
        for (let n of t.slots) {
          let [r] = rt(t.period, n);
          if (r === this.hour)
            return { courseId: this.course.id, from: { day: this.day, period: t.period, slot: n } };
        }
    return null;
  }
  store = u(We);
  typeLabel = ue(() => this.store.types().find((n) => n.id === this.course.typeId)?.label ?? '');
  onCardActivate() {
    this.dragging || this.openShare.emit(this.course);
  }
  onDragStarted() {
    ((this.dragging = !0), this.dragStart.emit());
  }
  onDragEnded() {
    setTimeout(() => {
      ((this.dragging = !1), this.dragEnd.emit());
    }, 0);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-course-card']],
    inputs: { course: 'course', day: 'day', hour: 'hour' },
    outputs: { dragStart: 'dragStart', dragEnd: 'dragEnd', openShare: 'openShare' },
    decls: 1,
    vars: 1,
    consts: [
      [
        'class',
        'course',
        'cdkDrag',
        '',
        'tabindex',
        '0',
        'role',
        'button',
        3,
        '--type',
        'cdkDragData',
        'cdkDragStarted',
        'cdkDragEnded',
        'click',
        'keydown.enter',
        'keydown.space',
        4,
        'ngIf',
      ],
      [
        'cdkDrag',
        '',
        'tabindex',
        '0',
        'role',
        'button',
        1,
        'course',
        3,
        'cdkDragStarted',
        'cdkDragEnded',
        'click',
        'keydown.enter',
        'keydown.space',
        'cdkDragData',
      ],
      [1, 'type-pill'],
      [1, 'row'],
      [1, 'title', 3, 'title'],
      [
        'cdkDragHandle',
        '',
        'type',
        'button',
        'aria-label',
        'Arrastar',
        1,
        'drag-handle',
        3,
        'click',
      ],
      ['name', 'lucideMove', 1, 'icon-16'],
      ['class', 'subtitle', 4, 'ngIf'],
      [1, 'subtitle'],
    ],
    template: function (n, r) {
      (n & 1 && Q(0, eC, 8, 6, 'div', 0), n & 2 && A('ngIf', r.visible));
    },
    dependencies: [ve, Ve, Ql, Uv, je],
    styles: [
      '@charset "UTF-8";[_nghost-%COMP%]{display:contents}.course[_ngcontent-%COMP%]{position:relative;margin:6px;padding:14px 12px;background:linear-gradient(180deg,color-mix(in oklab,var(--surface, #171923) 96%,transparent),transparent);border:1px solid var(--border, rgba(255, 255, 255, .08));border-radius:var(--radius, 16px);box-shadow:var(--shadow-1, 0 6px 18px rgba(0, 0, 0, .25));display:grid;gap:8px;cursor:pointer;transition:transform .12s cubic-bezier(.22,.61,.36,1),box-shadow .12s cubic-bezier(.22,.61,.36,1),background-color .12s ease;z-index:1}.course[_ngcontent-%COMP%]:hover{transform:translateY(-1px);box-shadow:var(--shadow-2, 0 12px 32px rgba(0, 0, 0, .35))}.course[_ngcontent-%COMP%]:focus-visible{outline:0;box-shadow:0 0 0 3px color-mix(in oklab,var(--type, #7c3aed) 35%,transparent)}.type-pill[_ngcontent-%COMP%]{position:absolute;left:-1px;top:10px;bottom:10px;width:4px;border-radius:4px;background:var(--type, var(--primary, #7c3aed))}.row[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:20px}.title[_ngcontent-%COMP%]{font-weight:800;font-size:14.5px;line-height:1.25;letter-spacing:.2px;color:var(--txt, #e6e9ef);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.drag-handle[_ngcontent-%COMP%]{display:grid;place-items:center;width:28px;height:28px;border-radius:999px;background:color-mix(in oklab,var(--surface, #171923) 100%,transparent);border:1px solid var(--border, rgba(255, 255, 255, .08));color:var(--muted, #94a3b8);transition:background .12s ease,transform .12s ease}.drag-handle[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.drag-handle[_ngcontent-%COMP%]:focus-visible{outline:0;box-shadow:0 0 0 3px color-mix(in oklab,var(--type, #7c3aed) 40%,transparent)}.cdk-drag-preview[_ngcontent-%COMP%]{z-index:10000;background:inherit;border:none!important;background-color:inherit;border-radius:inherit;box-shadow:var(--shadow-2, 0 12px 32px rgba(0, 0, 0, .35));padding:12px}.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:.15}.subtitle[_ngcontent-%COMP%]{font-size:12.5px;line-height:1.2;color:var(--muted, #94a3b8);font-weight:600;letter-spacing:.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:-2px}.course-card[_ngcontent-%COMP%]{background:var(--surface-2);border:1px solid color-mix(in oklab,var(--border) 85%,transparent);border-radius:14px;box-shadow:var(--shadow-1);position:relative}.course-card[_ngcontent-%COMP%]:before{content:none!important}.course-card[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{color:var(--txt);font-weight:700}.course-card[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{color:color-mix(in oklab,var(--txt) 72%,transparent);opacity:1}.grid-wrap.exporting[_ngcontent-%COMP%]   app-course-card[_ngcontent-%COMP%], .grid-wrap.exporting[_ngcontent-%COMP%]   .course-card[_ngcontent-%COMP%]{box-shadow:none!important;border-color:color-mix(in oklab,var(--border) 95%,transparent)!important}.course-card[cdkDrag][_ngcontent-%COMP%], .cdk-drag.course-card[_ngcontent-%COMP%]{touch-action:none;cursor:grab}.drag-handle[_ngcontent-%COMP%]{display:grid;place-items:center}.grid-wrap.exporting[_ngcontent-%COMP%]   [cdkDragHandle][_ngcontent-%COMP%], .grid-wrap.exporting[_ngcontent-%COMP%]   .drag-handle[_ngcontent-%COMP%], #course-share.exporting[_ngcontent-%COMP%]   [cdkDragHandle][_ngcontent-%COMP%], #course-share.exporting[_ngcontent-%COMP%]   .drag-handle[_ngcontent-%COMP%]{display:none!important}[data-theme=light][_nghost-%COMP%]   .course[_ngcontent-%COMP%], [data-theme=light]   [_nghost-%COMP%]   .course[_ngcontent-%COMP%], .theme-light[_nghost-%COMP%]   .course[_ngcontent-%COMP%], .theme-light   [_nghost-%COMP%]   .course[_ngcontent-%COMP%], .light[_nghost-%COMP%]   .course[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .course[_ngcontent-%COMP%]{background-color:#fff!important;background-image:none!important}[data-theme=light][_nghost-%COMP%]   .cdk-drag-preview[_ngcontent-%COMP%], [data-theme=light]   [_nghost-%COMP%]   .cdk-drag-preview[_ngcontent-%COMP%], .theme-light[_nghost-%COMP%]   .cdk-drag-preview[_ngcontent-%COMP%], .theme-light   [_nghost-%COMP%]   .cdk-drag-preview[_ngcontent-%COMP%], .light[_nghost-%COMP%]   .cdk-drag-preview[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .cdk-drag-preview[_ngcontent-%COMP%]{background-color:#fff!important}.grid-wrap.exporting[_nghost-%COMP%]   .drag-handle[_ngcontent-%COMP%], .grid-wrap.exporting   [_nghost-%COMP%]   .drag-handle[_ngcontent-%COMP%], .grid-wrap.exporting[_nghost-%COMP%]   [cdkDragHandle][_ngcontent-%COMP%], .grid-wrap.exporting   [_nghost-%COMP%]   [cdkDragHandle][_ngcontent-%COMP%]{display:none!important}#course-share.exporting[_nghost-%COMP%]   .drag-handle[_ngcontent-%COMP%], #course-share.exporting   [_nghost-%COMP%]   .drag-handle[_ngcontent-%COMP%], #course-share.exporting[_nghost-%COMP%]   [cdkDragHandle][_ngcontent-%COMP%], #course-share.exporting   [_nghost-%COMP%]   [cdkDragHandle][_ngcontent-%COMP%]{display:none!important}.grid-wrap.exporting[_nghost-%COMP%]   .row[_ngcontent-%COMP%], .grid-wrap.exporting   [_nghost-%COMP%]   .row[_ngcontent-%COMP%], #course-share.exporting[_nghost-%COMP%]   .row[_ngcontent-%COMP%], #course-share.exporting   [_nghost-%COMP%]   .row[_ngcontent-%COMP%]{justify-content:flex-start!important}.grid-wrap.exporting[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%]{background:var(--bg)!important}.grid-wrap.exporting[_ngcontent-%COMP%]   .timecol[_ngcontent-%COMP%], .grid-wrap.exporting[_ngcontent-%COMP%]   .daycol[_ngcontent-%COMP%], .grid-wrap.exporting[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%]{background:var(--bg)!important;box-shadow:none!important}.grid-wrap.exporting[_ngcontent-%COMP%]   .slotcell[_ngcontent-%COMP%], .grid-wrap.exporting[_ngcontent-%COMP%]   .timecell[_ngcontent-%COMP%]{background:transparent!important}.grid-wrap.exporting[_ngcontent-%COMP%]   .timecol[_ngcontent-%COMP%]{position:static!important;padding-right:var(--gap);margin-right:calc(var(--gap) * -1)}',
    ],
  });
};
function tC(e, t, n) {
  for (let r of e.meetings)
    if (r.day === t)
      for (let o of r.slots) {
        let [i] = rt(r.period, o);
        if (i === n) return !0;
      }
  return !1;
}
var nC = ['wrap'],
  Wv = (e, t, n) => ({ day: e, period: t, slot: n }),
  rC = (e, t) => ({ courseId: e, from: t });
function oC(e, t) {
  if ((e & 1 && (f(0, 'div', 12), M(1), v()), e & 2)) {
    let n = t.$implicit,
      r = t.index,
      o = k().$implicit;
    (Ne('data-role', 'time')('data-p', o)('data-i', r), m(), xe(' ', n.label, ' '));
  }
}
function iC(e, t) {
  if (e & 1) {
    let n = _e();
    (St(0),
      f(1, 'button', 7),
      S('click', function () {
        let o = C(n).$implicit,
          i = k();
        return D(i.onToggle(o));
      }),
      f(2, 'span', 8),
      M(3),
      v(),
      f(4, 'span', 9),
      M(5),
      v()(),
      f(6, 'div', 10),
      Q(7, oC, 2, 4, 'div', 11),
      v(),
      It());
  }
  if (e & 2) {
    let n = t.$implicit,
      r = k();
    (m(),
      Ne('aria-expanded', r.isOpen(n)),
      m(2),
      he(r.isOpen(n) ? '\u25BE' : '\u25B8'),
      m(2),
      he(r.periodLabel(n)),
      m(),
      ie('collapsed', !r.isOpen(n)),
      m(),
      A('ngForOf', r.rowsView()[n])('ngForTrackBy', r.trackRow));
  }
}
function sC(e, t) {
  if (e & 1) {
    let n = _e();
    (f(0, 'div', 19),
      S('cdkDragMoved', function (o) {
        C(n);
        let i = k(4);
        return D(i.onDragMove(o));
      })('cdkDragStarted', function () {
        C(n);
        let o = k(4);
        return D(o.onAnyDragStart());
      })('cdkDragReleased', function () {
        C(n);
        let o = k(4);
        return D(o.onAnyDragEnd());
      }),
      f(1, 'app-course-card', 20),
      S('openShare', function (o) {
        C(n);
        let i = k(4);
        return D(i.openShare.emit(o));
      }),
      v()());
  }
  if (e & 2) {
    let n = t.$implicit,
      r = k().$implicit,
      o = k().$implicit,
      i = k().$implicit,
      s = k();
    (A('cdkDragData', fu(8, rC, n.id, sl(4, Wv, i, o, s.hourToSlot(o, r.hStart)))),
      m(),
      A('course', n)('day', i)('hour', r.hStart));
  }
}
function aC(e, t) {
  if (e & 1) {
    let n = _e();
    (f(0, 'div', 17),
      S('click', function (o) {
        let i = C(n).$implicit,
          s = k().$implicit,
          a = k().$implicit,
          l = k();
        return D(l.onSlotClick(a, s, i.hStart, o));
      })('cdkDropListDropped', function (o) {
        C(n);
        let i = k(3);
        return D(i.onDrop(o));
      }),
      Q(1, sC, 2, 11, 'div', 18),
      v());
  }
  if (e & 2) {
    let n = t.$implicit,
      r = t.index,
      o = k().$implicit,
      i = k().$implicit,
      s = k();
    (ie('empty', !s.hasCourseAt(i, o, n.hStart)),
      A('id', 'slot-' + i + '-' + o + '-' + n.hStart)(
        'cdkDropListData',
        sl(11, Wv, i, o, s.hourToSlot(o, n.hStart)),
      )('cdkDropListEnterPredicate', s.enterAlways)('cdkDropListConnectedTo', s.connectedTo),
      Ne('data-role', 'slot')('data-p', o)('data-i', r),
      m(),
      A('ngForOf', s.store.courses())('ngForTrackBy', s.trackCourse));
  }
}
function lC(e, t) {
  if (
    (e & 1 && (St(0), E(1, 'div', 15), f(2, 'div', 10), Q(3, aC, 2, 15, 'div', 16), v(), It()),
    e & 2)
  ) {
    let n = t.$implicit,
      r = k(2);
    (m(2),
      ie('collapsed', !r.isOpen(n)),
      m(),
      A('ngForOf', r.rowsView()[n])('ngForTrackBy', r.trackRow));
  }
}
function cC(e, t) {
  if (
    (e & 1 && (f(0, 'div', 13)(1, 'div', 14), M(2), v(), Q(3, lC, 4, 4, 'ng-container', 5), v()),
    e & 2)
  ) {
    let n = t.$implicit,
      r = k();
    (m(2), he(r.dayLabel(n)), m(), A('ngForOf', r.periods)('ngForTrackBy', r.trackPeriod));
  }
}
var cs = class e {
  constructor(t, n, r) {
    this.store = t;
    this.zone = n;
    this.cdr = r;
    On(() => {
      let o = hC(this.store.courses());
      ((o.M || o.T || o.N) && this.open.set(o), this.debouncedSyncRowHeights());
    });
  }
  openShare = new T();
  addAt = new T();
  wrap;
  onDragMove(t) {
    let n = this.wrap.nativeElement,
      { x: r, y: o } = t.pointerPosition,
      i = n.getBoundingClientRect(),
      s = 64,
      a = 28,
      l = o - i.top,
      c = i.bottom - o;
    l < s
      ? (n.scrollTop -= Math.ceil(((s - l) / s) * a))
      : c < s && (n.scrollTop += Math.ceil(((s - c) / s) * a));
    let d = r - i.left,
      h = i.right - r;
    d < s
      ? (n.scrollLeft -= Math.ceil(((s - d) / s) * a))
      : h < s && (n.scrollLeft += Math.ceil(((s - h) / s) * a));
  }
  lists;
  connectedTo = [];
  ro;
  mo;
  syncTimeoutId;
  alwaysAllow = () => !0;
  days = ['2', '3', '4', '5', '6', '7'];
  periods = ['M', 'T', 'N'];
  open = W({ M: !0, T: !0, N: !0 });
  isDragging = W(!1);
  prevOpen = null;
  activeHours = ue(() => uC(this.store.courses()));
  rowsAll = ue(() => ls());
  rowsUI = ue(() => ls());
  enterAlways = (t, n) => !0;
  exportMode = W(!1);
  rowsView = ue(() => (this.exportMode() ? Zv(this.store.courses()) : ls()));
  lockHeightsAll() {
    let t = this.wrap?.nativeElement;
    if (t) {
      t.querySelectorAll('.timecell[data-p][data-i], .slotcell[data-p][data-i]').forEach((n) => {
        ((n.style.height = ''), (n.style.minHeight = ''));
      });
      for (let n of this.periods) {
        let r = Array.from(t.querySelectorAll(`.timecell[data-role="time"][data-p="${n}"]`));
        for (let o = 0; o < r.length; o++) {
          let i = r[o],
            s = Array.from(
              t.querySelectorAll(`.slotcell[data-role="slot"][data-p="${n}"][data-i="${o}"]`),
            );
          if (!s.length) continue;
          i.offsetHeight;
          let a = [i, ...s],
            l = Math.max(...a.map((d) => d.getBoundingClientRect().height), 80),
            c = `${Math.ceil(l)}px`;
          a.forEach((d) => {
            ((d.style.height = c), (d.style.minHeight = c));
          });
        }
      }
    }
  }
  unlockHeightsAll() {
    let t = this.wrap?.nativeElement;
    t &&
      t.querySelectorAll('.timecell[data-p][data-i], .slotcell[data-p][data-i]').forEach((n) => {
        ((n.style.height = ''), (n.style.minHeight = ''));
      });
  }
  async enableExportMode() {
    (this.exportMode.set(!0),
      this.cdr.detectChanges(),
      await new Promise((t) => requestAnimationFrame(() => requestAnimationFrame(t))),
      this.lockHeightsAll());
  }
  disableExportMode() {
    (this.unlockHeightsAll(),
      this.exportMode.set(!1),
      this.cdr.detectChanges(),
      requestAnimationFrame(() => this.syncRowHeights()));
  }
  rowsByPeriod = ue(() => dC(this.store.courses()));
  isHourActive(t, n) {
    return !0;
  }
  onSlotClick(t, n, r, o) {
    if (this.isDragging() || o.target.closest('app-course-card')) return;
    let s = this.hourToSlot(n, r);
    this.store
      .courses()
      .some((l) =>
        (l.meetings ?? []).some(
          (c) => c.day === t && c.period === n && (c.slots ?? []).includes(s),
        ),
      ) || this.addAt.emit({ day: t, period: n, slot: s });
  }
  hasCourseAt(t, n, r) {
    let o = this.hourToSlot(n, r);
    return this.store
      .courses()
      .some((i) =>
        (i.meetings ?? []).some(
          (s) => s.day === t && s.period === n && (s.slots ?? []).includes(o),
        ),
      );
  }
  onAnyDragStart() {
    this.isDragging() ||
      (this.isDragging.set(!0),
      (this.prevOpen = this.open()),
      this.open.set({ M: !0, T: !0, N: !0 }),
      this.cdr.detectChanges(),
      (this.connectedTo = this.lists.toArray()));
  }
  onAnyDragEnd() {
    (this.isDragging.set(!1),
      this.prevOpen && this.open.set(this.prevOpen),
      (this.prevOpen = null));
  }
  isOpen(t) {
    return this.open()[t];
  }
  onToggle(t) {
    (this.open.update((n) => F(w({}, n), { [t]: !n[t] })),
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.syncRowHeights());
      }));
  }
  dayLabel(t) {
    return Ao[t] ?? t;
  }
  periodLabel(t) {
    return t === 'M' ? 'Manh\xE3' : t === 'T' ? 'Tarde' : 'Noite';
  }
  trackPeriod = (t, n) => n;
  trackRow = (t, n) => `${n.period}-${n.hStart}`;
  trackDay = (t, n) => n;
  trackCourse = (t, n) => n.id;
  hourToSlot(t, n) {
    let r = t === 'T' ? 6 : 5;
    for (let o = 1; o <= r; o++) {
      let [i] = rt(t, o);
      if (i === n) return o;
    }
    return 1;
  }
  onDrop(t) {
    let n = t.container?.data,
      r = t.item?.data;
    if (!n || !r) return;
    let { courseId: o, from: i } = r,
      s = n;
    if (i.day === s.day && i.period === s.period && i.slot === s.slot) return;
    let a = this.store.courses().find((h) => h.id === o);
    if (!a) return;
    let l = F(w({}, a), { meetings: a.meetings.map((h) => F(w({}, h), { slots: [...h.slots] })) }),
      c = l.meetings.findIndex((h) => h.day === i.day && h.period === i.period);
    if (c >= 0) {
      let h = l.meetings[c];
      ((h.slots = h.slots.filter((g) => g !== i.slot)), h.slots.length || l.meetings.splice(c, 1));
    }
    let d = l.meetings.findIndex((h) => h.day === s.day && h.period === s.period);
    if (d >= 0) {
      let h = l.meetings[d];
      (h.slots.includes(s.slot) || h.slots.push(s.slot), h.slots.sort((g, p) => g - p));
    } else l.meetings.push({ day: s.day, period: s.period, slots: [s.slot] });
    (this.store.upsertCourse(l), this.debouncedSyncRowHeights());
  }
  ngAfterViewInit() {
    (this.zone.runOutsideAngular(() => {
      ((this.ro = new ResizeObserver(() => {
        this.debouncedSyncRowHeights();
      })),
        this.ro.observe(this.wrap.nativeElement),
        (this.mo = new MutationObserver((t) => {
          t.some(
            (r) =>
              r.type === 'childList' ||
              (r.type === 'attributes' &&
                ['data-p', 'data-i', 'class'].includes(r.attributeName || '')),
          ) && this.debouncedSyncRowHeights();
        })),
        this.mo.observe(this.wrap.nativeElement, {
          childList: !0,
          subtree: !0,
          attributes: !0,
          attributeFilter: ['data-p', 'data-i', 'class'],
        }));
    }),
      (this.connectedTo = this.lists.toArray()),
      this.lists.changes.subscribe(() => {
        this.connectedTo = this.lists.toArray();
      }),
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.syncRowHeights());
      }));
  }
  onWindowResize() {
    this.debouncedSyncRowHeights();
  }
  ngOnDestroy() {
    (this.ro?.disconnect(),
      this.mo?.disconnect(),
      this.syncTimeoutId && clearTimeout(this.syncTimeoutId));
  }
  debouncedSyncRowHeights() {
    (this.syncTimeoutId && clearTimeout(this.syncTimeoutId),
      (this.syncTimeoutId = window.setTimeout(() => {
        this.syncRowHeights();
      }, 16)));
  }
  syncRowHeights() {
    let t = this.wrap?.nativeElement;
    if (!t) return;
    t.querySelectorAll('.slotcell[data-p][data-i], .timecell[data-p][data-i]').forEach((r) => {
      ((r.style.minHeight = ''), (r.style.height = ''));
    });
    for (let r of this.periods) {
      if (!this.isOpen(r)) continue;
      let o = Array.from(t.querySelectorAll(`.timecell[data-role="time"][data-p="${r}"]`));
      for (let i = 0; i < o.length; i++) {
        let s = o[i],
          a = Array.from(
            t.querySelectorAll(`.slotcell[data-role="slot"][data-p="${r}"][data-i="${i}"]`),
          );
        a.length &&
          requestAnimationFrame(() => {
            let l = this.getElementHeight(s),
              c = a.map((g) => this.getElementHeight(g)),
              d = Math.max(l, ...c, 80),
              h = `${Math.ceil(d)}px`;
            ((s.style.minHeight = h), a.forEach((g) => (g.style.minHeight = h)));
          });
      }
    }
  }
  getElementHeight(t) {
    return t.getBoundingClientRect().height;
  }
  static ɵfac = function (n) {
    return new (n || e)(I(We), I(X), I(wt));
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-schedule-grid']],
    viewQuery: function (n, r) {
      if ((n & 1 && (wr(nC, 7), wr(Pp, 5)), n & 2)) {
        let o;
        (mr((o = kr())) && (r.wrap = o.first), mr((o = kr())) && (r.lists = o));
      }
    },
    hostBindings: function (n, r) {
      n & 1 &&
        S(
          'resize',
          function () {
            return r.onWindowResize();
          },
          Lh,
        );
    },
    outputs: { openShare: 'openShare', addAt: 'addAt' },
    decls: 8,
    vars: 6,
    consts: [
      ['wrap', ''],
      ['id', 'grid', 'cdkScrollable', '', 1, 'grid-wrap', 'container', 'scroll-animated'],
      ['cdkDropListGroup', '', 1, 'grid'],
      [1, 'col', 'timecol'],
      [1, 'timecell', 'head'],
      [4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
      ['class', 'col daycol', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
      ['type', 'button', 1, 'folder', 3, 'click'],
      [1, 'arrow'],
      [1, 'label'],
      [1, 'period-block'],
      ['class', 'timecell', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
      [1, 'timecell'],
      [1, 'col', 'daycol'],
      [1, 'daycell', 'head'],
      [1, 'folder-spacer'],
      [
        'class',
        'slotcell',
        'cdkDropList',
        '',
        'cdkDropListSortingDisabled',
        'true',
        3,
        'empty',
        'id',
        'cdkDropListData',
        'cdkDropListEnterPredicate',
        'cdkDropListConnectedTo',
        'click',
        'cdkDropListDropped',
        4,
        'ngFor',
        'ngForOf',
        'ngForTrackBy',
      ],
      [
        'cdkDropList',
        '',
        'cdkDropListSortingDisabled',
        'true',
        1,
        'slotcell',
        3,
        'click',
        'cdkDropListDropped',
        'id',
        'cdkDropListData',
        'cdkDropListEnterPredicate',
        'cdkDropListConnectedTo',
      ],
      [
        'cdkDrag',
        '',
        3,
        'cdkDragData',
        'cdkDragMoved',
        'cdkDragStarted',
        'cdkDragReleased',
        4,
        'ngFor',
        'ngForOf',
        'ngForTrackBy',
      ],
      ['cdkDrag', '', 3, 'cdkDragMoved', 'cdkDragStarted', 'cdkDragReleased', 'cdkDragData'],
      [3, 'openShare', 'course', 'day', 'hour'],
    ],
    template: function (n, r) {
      (n & 1 &&
        (f(0, 'div', 1, 0)(2, 'div', 2)(3, 'div', 3)(4, 'div', 4),
        M(5, 'Hor\xE1rio'),
        v(),
        Q(6, iC, 8, 7, 'ng-container', 5),
        v(),
        Q(7, cC, 4, 3, 'div', 6),
        v()()),
        n & 2 &&
          (ie('dragging', r.isDragging()),
          m(6),
          A('ngForOf', r.periods)('ngForTrackBy', r.trackPeriod),
          m(),
          A('ngForOf', r.days)('ngForTrackBy', r.trackDay)));
    },
    dependencies: [ve, Wt, Gv, Pp, Jl, Ql, mv, vv],
    styles: [
      '[_nghost-%COMP%]{--time-col-w: 148px;--day-col-min: 200px;--row-h: 80px;--gap: 14px;--pad-col: 10px;--folder-h: 44px;--row-gap: 1.75rem}.grid-wrap[_ngcontent-%COMP%]{overflow-x:auto;padding-inline:4px;overflow-y:auto;touch-action:pan-x pan-y;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity;position:relative;touch-action:auto}.grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:var(--time-col-w, 148px) repeat(6,minmax(var(--day-col-min, 200px),1fr));column-gap:var(--gap, 14px);row-gap:var(--gap, 14px);align-items:start}.col[_ngcontent-%COMP%]{display:grid;grid-template-rows:56px auto}.head[_ngcontent-%COMP%]{position:sticky;top:0;z-index:1;display:grid;place-items:center;background:linear-gradient(180deg,color-mix(in oklab,var(--bg) 88%,transparent),color-mix(in oklab,var(--bg) 60%,transparent));-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid var(--border);border-radius:12px}.folder[_ngcontent-%COMP%], .folder-spacer[_ngcontent-%COMP%]{height:var(--folder-h);border-radius:12px;border:1px solid var(--border);margin-block:10px}.folder[_ngcontent-%COMP%]{position:relative;z-index:2;display:flex;align-items:center;gap:12px;padding:0 16px;background:var(--surface-2);color:var(--txt);text-align:left;transition:transform .14s ease,background .14s ease,border-color .14s ease}.folder[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.folder[_ngcontent-%COMP%]:focus-visible{outline:0;box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 35%,transparent)}.folder[_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]{width:18px;display:inline-block}.folder[aria-expanded=false][_ngcontent-%COMP%]{opacity:.85}.folder-spacer[_ngcontent-%COMP%]{background:transparent;border-style:dashed}.period-block[_ngcontent-%COMP%]{display:grid;grid-auto-rows:minmax(var(--row-h),auto);row-gap:var(--row-gap);column-gap:var(--gap)}.timecol[_ngcontent-%COMP%]   .timecell[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;color:var(--muted);border:1px dashed var(--border);border-radius:12px;position:relative;padding-inline:var(--pad-col);overflow:hidden}.slotcell[_ngcontent-%COMP%]{position:relative;min-height:var(--row-h);border:1px dashed var(--grid-line);border-radius:12px;overflow:visible;transition:background .16s ease;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:8px;gap:4px}.slotcell[_ngcontent-%COMP%]:before{content:"";position:absolute;left:14px;right:14px;top:50%;transform:translateY(-50%);border-top:1px dashed var(--grid-line);opacity:.65;z-index:0;pointer-events:none}.theme-light[_ngcontent-%COMP%]   .slotcell[_ngcontent-%COMP%]:before{opacity:.85}.slotcell[_ngcontent-%COMP%]:hover{background:color-mix(in oklab,var(--surface-2) 60%,transparent)}.slotcell[_ngcontent-%COMP%]   app-course-card[_ngcontent-%COMP%]{position:relative;z-index:1;width:100%;flex-shrink:0}.folder-enter[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_folderDown .22s cubic-bezier(.22,.61,.36,1) both}.folder-leave[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_folderUp .16s ease both}@keyframes _ngcontent-%COMP%_folderDown{0%{opacity:0;transform:translateY(-6px) scaleY(.98);transform-origin:top}to{opacity:1;transform:translateY(0) scaleY(1)}}@keyframes _ngcontent-%COMP%_folderUp{0%{opacity:1;transform:translateY(0) scaleY(1);transform-origin:top}to{opacity:0;transform:translateY(-6px) scaleY(.98)}}.cdk-drag-preview[_ngcontent-%COMP%]{z-index:10000;transform:rotate(5deg);box-shadow:0 5px 15px #0000004d}.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:.3;transform:scale(.95)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .25s cubic-bezier(0,0,.2,1)}@media (max-width: 900px){[_nghost-%COMP%]{--time-col-w: 102px;--day-col-min: 240px;--row-h: 72px;--gap: 16px;--row-gap: 1.5rem}.col[_ngcontent-%COMP%]{grid-template-rows:52px auto}.slotcell[_ngcontent-%COMP%]{padding:6px}}@media (max-width: 640px){[_nghost-%COMP%]{--time-col-w: 90px;--day-col-min: 200px;--row-h: 64px;--gap: 18px;--row-gap: 1.25rem}.folder[_ngcontent-%COMP%]{padding:0 12px;font-size:.9em}.daycol[_ngcontent-%COMP%]:first-of-type{margin-left:8px}}.slotcell.ghost[_ngcontent-%COMP%], .timecell.ghost[_ngcontent-%COMP%]{opacity:.35;pointer-events:auto;min-height:var(--row-h);border-style:dashed}.dragging[_ngcontent-%COMP%]   .slotcell.ghost[_ngcontent-%COMP%]{background:color-mix(in oklab,var(--surface-2) 35%,transparent);border-style:dashed}.dragging[_ngcontent-%COMP%]   .slotcell.ghost[_ngcontent-%COMP%]:hover{opacity:.55}.dragging[_ngcontent-%COMP%]   .slotcell[_ngcontent-%COMP%]{cursor:copy}.slotcell.empty[_ngcontent-%COMP%]{cursor:pointer}.slotcell.empty[_ngcontent-%COMP%]:hover{background:color-mix(in oklab,var(--surface-2) 50%,transparent);border-style:solid}.grid-wrap.exporting[_ngcontent-%COMP%]   .timecol[_ngcontent-%COMP%], .grid-wrap.exporting[_ngcontent-%COMP%]   .head[_ngcontent-%COMP%]{position:static!important;box-shadow:none!important}.timecol[_ngcontent-%COMP%]{position:sticky;left:0;z-index:3;background:linear-gradient(180deg,color-mix(in oklab,var(--bg) 88%,transparent),color-mix(in oklab,var(--bg) 60%,transparent));box-shadow:4px 0 0 0 var(--bg, transparent)}.timecol[_ngcontent-%COMP%]   .timecell.head[_ngcontent-%COMP%]{z-index:4}.grid-wrap[_ngcontent-%COMP%]:not(.dragging)   .timecol[_ngcontent-%COMP%]{position:static}.dragging[_ngcontent-%COMP%]   .period-block[_ngcontent-%COMP%]{grid-auto-rows:var(--row-h)!important}.dragging[_ngcontent-%COMP%]   .slotcell[_ngcontent-%COMP%]{min-height:var(--row-h)}.timecell.inactive[_ngcontent-%COMP%], .slotcell.inactive[_ngcontent-%COMP%]{display:none}.cdk-global-dragging[_ngcontent-%COMP%]   .timecell.inactive[_ngcontent-%COMP%], .cdk-global-dragging[_ngcontent-%COMP%]   .slotcell.inactive[_ngcontent-%COMP%]{display:flex}.cdk-global-dragging[_ngcontent-%COMP%]   .period-block[_ngcontent-%COMP%]{grid-auto-rows:var(--row-h)!important}.period-block.collapsed[_ngcontent-%COMP%]{display:none!important}.period-block.collapsed[_ngcontent-%COMP%]{row-gap:0}.period-block.collapsed[_ngcontent-%COMP%]   .timecell[_ngcontent-%COMP%], .period-block.collapsed[_ngcontent-%COMP%]   .slotcell[_ngcontent-%COMP%]{height:0;min-height:0;padding:0;border-width:0;margin:0;overflow:hidden;pointer-events:none}.grid-wrap.dragging[_ngcontent-%COMP%]{scroll-snap-type:none!important;-webkit-overflow-scrolling:auto}.grid-wrap.exporting[_ngcontent-%COMP%]{overflow:visible!important;transform:none!important;scroll-snap-type:none!important}.slotcell[_ngcontent-%COMP%]   app-course-card[_ngcontent-%COMP%]{margin:0}.grid-wrap.exporting[_ngcontent-%COMP%]   .timecol[_ngcontent-%COMP%]{position:static!important;box-shadow:none!important;background:var(--bg);padding-right:var(--gap);margin-right:calc(var(--gap) * -1)}',
    ],
  });
};
function Ro(e, t) {
  return { period: e, hStart: t, hEnd: t + 1, label: `${Ot(t)}\u2013${Ot(t + 1)}` };
}
function ls() {
  return {
    M: Array.from({ length: 5 }, (e, t) => Ro('M', 7 + t)),
    T: Array.from({ length: 6 }, (e, t) => Ro('T', 12 + t)),
    N: Array.from({ length: 5 }, (e, t) => Ro('N', 18 + t)),
  };
}
function Zv(e) {
  let t = new Set(),
    n = new Set(),
    r = new Set();
  for (let o of e)
    for (let i of o.meetings ?? [])
      for (let s of i.slots ?? []) {
        let [a] = rt(i.period, s);
        i.period === 'M' ? t.add(a) : i.period === 'T' ? n.add(a) : r.add(a);
      }
  return !t.size && !n.size && !r.size
    ? ls()
    : {
        M: [...t].sort((o, i) => o - i).map((o) => Ro('M', o)),
        T: [...n].sort((o, i) => o - i).map((o) => Ro('T', o)),
        N: [...r].sort((o, i) => o - i).map((o) => Ro('N', o)),
      };
}
function dC(e) {
  let t = !1;
  for (let n of e) {
    for (let r of n.meetings ?? [])
      if (r.slots?.length) {
        t = !0;
        break;
      }
    if (t) break;
  }
  return t ? Zv(e) : ls();
}
function hC(e) {
  let t = { M: !1, T: !1, N: !1 };
  for (let n of e) for (let r of n.meetings ?? []) r.slots?.length && (t[r.period] = !0);
  return t;
}
function uC(e) {
  let t = new Set(),
    n = new Set(),
    r = new Set();
  for (let o of e)
    for (let i of o.meetings ?? [])
      for (let s of i.slots ?? []) {
        let [a] = rt(i.period, s);
        i.period === 'M' ? t.add(a) : i.period === 'T' ? n.add(a) : r.add(a);
      }
  return { M: t, T: n, N: r };
}
var rw = (() => {
    class e {
      _renderer;
      _elementRef;
      onChange = (n) => {};
      onTouched = () => {};
      constructor(n, r) {
        ((this._renderer = n), (this._elementRef = r));
      }
      setProperty(n, r) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, r);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty('disabled', n);
      }
      static ɵfac = function (r) {
        return new (r || e)(I(pt), I(ge));
      };
      static ɵdir = oe({ type: e });
    }
    return e;
  })(),
  Bp = (() => {
    class e extends rw {
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Tn(e)))(o || e);
        };
      })();
      static ɵdir = oe({ type: e, features: [ft] });
    }
    return e;
  })(),
  ac = new _('');
var pC = { provide: ac, useExisting: Mt(() => lc), multi: !0 };
function gC() {
  let e = mt() ? mt().getUserAgent() : '';
  return /android (\d+)/.test(e.toLowerCase());
}
var fC = new _(''),
  lc = (() => {
    class e extends rw {
      _compositionMode;
      _composing = !1;
      constructor(n, r, o) {
        (super(n, r),
          (this._compositionMode = o),
          this._compositionMode == null && (this._compositionMode = !gC()));
      }
      writeValue(n) {
        let r = n ?? '';
        this.setProperty('value', r);
      }
      _handleInput(n) {
        (!this._compositionMode || (this._compositionMode && !this._composing)) && this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        ((this._composing = !1), this._compositionMode && this.onChange(n));
      }
      static ɵfac = function (r) {
        return new (r || e)(I(pt), I(ge), I(fC, 8));
      };
      static ɵdir = oe({
        type: e,
        selectors: [
          ['input', 'formControlName', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControlName', ''],
          ['input', 'formControl', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControl', ''],
          ['input', 'ngModel', '', 3, 'type', 'checkbox'],
          ['textarea', 'ngModel', ''],
          ['', 'ngDefaultControl', ''],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            S('input', function (s) {
              return o._handleInput(s.target.value);
            })('blur', function () {
              return o.onTouched();
            })('compositionstart', function () {
              return o._compositionStart();
            })('compositionend', function (s) {
              return o._compositionEnd(s.target.value);
            });
        },
        standalone: !1,
        features: [qe([pC]), ft],
      });
    }
    return e;
  })();
var ow = new _(''),
  iw = new _('');
function sw(e) {
  return e != null;
}
function aw(e) {
  return An(e) ? ce(e) : e;
}
function lw(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? w(w({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function cw(e, t) {
  return t.map((n) => n(e));
}
function vC(e) {
  return !e.validate;
}
function dw(e) {
  return e.map((t) => (vC(t) ? t : (n) => t.validate(n)));
}
function wC(e) {
  if (!e) return null;
  let t = e.filter(sw);
  return t.length == 0
    ? null
    : function (n) {
        return lw(cw(n, t));
      };
}
function Lp(e) {
  return e != null ? wC(dw(e)) : null;
}
function mC(e) {
  if (!e) return null;
  let t = e.filter(sw);
  return t.length == 0
    ? null
    : function (n) {
        let r = cw(n, t).map(aw);
        return Uc(r).pipe(G(lw));
      };
}
function Fp(e) {
  return e != null ? mC(dw(e)) : null;
}
function Yv(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function kC(e) {
  return e._rawValidators;
}
function yC(e) {
  return e._rawAsyncValidators;
}
function Op(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function tc(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function Kv(e, t) {
  let n = Op(t);
  return (
    Op(e).forEach((o) => {
      tc(n, o) || n.push(o);
    }),
    n
  );
}
function Qv(e, t) {
  return Op(t).filter((n) => !tc(e, n));
}
var nc = class {
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
      ((this._rawValidators = t || []), (this._composedValidatorFn = Lp(this._rawValidators)));
    }
    _setAsyncValidators(t) {
      ((this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = Fp(this._rawAsyncValidators)));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      (this._onDestroyCallbacks.forEach((t) => t()), (this._onDestroyCallbacks = []));
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1;
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null;
    }
  },
  No = class extends nc {
    name;
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  fs = class extends nc {
    _parent = null;
    name = null;
    valueAccessor = null;
  },
  rc = class {
    _cd;
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return (this._cd?.control?._touched?.(), !!this._cd?.control?.touched);
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return (this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine);
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return (this._cd?.control?._status?.(), !!this._cd?.control?.valid);
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return (this._cd?._submitted?.(), !!this._cd?.submitted);
    }
  },
  _C = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  oU = F(w({}, _C), { '[class.ng-submitted]': 'isSubmitted' }),
  hw = (() => {
    class e extends rc {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(I(fs, 2));
      };
      static ɵdir = oe({
        type: e,
        selectors: [
          ['', 'formControlName', ''],
          ['', 'ngModel', ''],
          ['', 'formControl', ''],
        ],
        hostVars: 14,
        hostBindings: function (r, o) {
          r & 2 &&
            ie('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)(
              'ng-pristine',
              o.isPristine,
            )('ng-dirty', o.isDirty)('ng-valid', o.isValid)('ng-invalid', o.isInvalid)(
              'ng-pending',
              o.isPending,
            );
        },
        standalone: !1,
        features: [ft],
      });
    }
    return e;
  })(),
  uw = (() => {
    class e extends rc {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(I(No, 10));
      };
      static ɵdir = oe({
        type: e,
        selectors: [
          ['', 'formGroupName', ''],
          ['', 'formArrayName', ''],
          ['', 'ngModelGroup', ''],
          ['', 'formGroup', ''],
          ['form', 3, 'ngNoForm', ''],
          ['', 'ngForm', ''],
        ],
        hostVars: 16,
        hostBindings: function (r, o) {
          r & 2 &&
            ie('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)(
              'ng-pristine',
              o.isPristine,
            )('ng-dirty', o.isDirty)('ng-valid', o.isValid)('ng-invalid', o.isInvalid)(
              'ng-pending',
              o.isPending,
            )('ng-submitted', o.isSubmitted);
        },
        standalone: !1,
        features: [ft],
      });
    }
    return e;
  })();
var ds = 'VALID',
  ec = 'INVALID',
  Po = 'PENDING',
  hs = 'DISABLED',
  Vn = class {},
  oc = class extends Vn {
    value;
    source;
    constructor(t, n) {
      (super(), (this.value = t), (this.source = n));
    }
  },
  ps = class extends Vn {
    pristine;
    source;
    constructor(t, n) {
      (super(), (this.pristine = t), (this.source = n));
    }
  },
  gs = class extends Vn {
    touched;
    source;
    constructor(t, n) {
      (super(), (this.touched = t), (this.source = n));
    }
  },
  Oo = class extends Vn {
    status;
    source;
    constructor(t, n) {
      (super(), (this.status = t), (this.source = n));
    }
  },
  Np = class extends Vn {
    source;
    constructor(t) {
      (super(), (this.source = t));
    }
  },
  jp = class extends Vn {
    source;
    constructor(t) {
      (super(), (this.source = t));
    }
  };
function pw(e) {
  return (cc(e) ? e.validators : e) || null;
}
function xC(e) {
  return Array.isArray(e) ? Lp(e) : e || null;
}
function gw(e, t) {
  return (cc(t) ? t.asyncValidators : e) || null;
}
function MC(e) {
  return Array.isArray(e) ? Fp(e) : e || null;
}
function cc(e) {
  return e != null && !Array.isArray(e) && typeof e == 'object';
}
function CC(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new b(1e3, '');
  if (!r[n]) throw new b(1001, '');
}
function DC(e, t, n) {
  e._forEachChild((r, o) => {
    if (n[o] === void 0) throw new b(1002, '');
  });
}
var ic = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {};
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, n) {
      (this._assignValidators(t), this._assignAsyncValidators(n));
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return Ce(this.statusReactive);
    }
    set status(t) {
      Ce(() => this.statusReactive.set(t));
    }
    _status = ue(() => this.statusReactive());
    statusReactive = W(void 0);
    get valid() {
      return this.status === ds;
    }
    get invalid() {
      return this.status === ec;
    }
    get pending() {
      return this.status == Po;
    }
    get disabled() {
      return this.status === hs;
    }
    get enabled() {
      return this.status !== hs;
    }
    errors;
    get pristine() {
      return Ce(this.pristineReactive);
    }
    set pristine(t) {
      Ce(() => this.pristineReactive.set(t));
    }
    _pristine = ue(() => this.pristineReactive());
    pristineReactive = W(!0);
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return Ce(this.touchedReactive);
    }
    set touched(t) {
      Ce(() => this.touchedReactive.set(t));
    }
    _touched = ue(() => this.touchedReactive());
    touchedReactive = W(!1);
    get untouched() {
      return !this.touched;
    }
    _events = new P();
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
      return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(Kv(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(Kv(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(Qv(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(Qv(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return tc(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return tc(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      let n = this.touched === !1;
      this.touched = !0;
      let r = t.sourceControl ?? this;
      (this._parent && !t.onlySelf && this._parent.markAsTouched(F(w({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new gs(!0, r)));
    }
    markAllAsDirty(t = {}) {
      (this.markAsDirty({ onlySelf: !0, emitEvent: t.emitEvent, sourceControl: this }),
        this._forEachChild((n) => n.markAllAsDirty(t)));
    }
    markAllAsTouched(t = {}) {
      (this.markAsTouched({ onlySelf: !0, emitEvent: t.emitEvent, sourceControl: this }),
        this._forEachChild((n) => n.markAllAsTouched(t)));
    }
    markAsUntouched(t = {}) {
      let n = this.touched === !0;
      ((this.touched = !1), (this._pendingTouched = !1));
      let r = t.sourceControl ?? this;
      (this._forEachChild((o) => {
        o.markAsUntouched({ onlySelf: !0, emitEvent: t.emitEvent, sourceControl: r });
      }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
        n && t.emitEvent !== !1 && this._events.next(new gs(!1, r)));
    }
    markAsDirty(t = {}) {
      let n = this.pristine === !0;
      this.pristine = !1;
      let r = t.sourceControl ?? this;
      (this._parent && !t.onlySelf && this._parent.markAsDirty(F(w({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new ps(!1, r)));
    }
    markAsPristine(t = {}) {
      let n = this.pristine === !1;
      ((this.pristine = !0), (this._pendingDirty = !1));
      let r = t.sourceControl ?? this;
      (this._forEachChild((o) => {
        o.markAsPristine({ onlySelf: !0, emitEvent: t.emitEvent });
      }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
        n && t.emitEvent !== !1 && this._events.next(new ps(!0, r)));
    }
    markAsPending(t = {}) {
      this.status = Po;
      let n = t.sourceControl ?? this;
      (t.emitEvent !== !1 &&
        (this._events.next(new Oo(this.status, n)), this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(F(w({}, t), { sourceControl: n })));
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      ((this.status = hs),
        (this.errors = null),
        this._forEachChild((o) => {
          o.disable(F(w({}, t), { onlySelf: !0 }));
        }),
        this._updateValue());
      let r = t.sourceControl ?? this;
      (t.emitEvent !== !1 &&
        (this._events.next(new oc(this.value, r)),
        this._events.next(new Oo(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(F(w({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((o) => o(!0)));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      ((this.status = ds),
        this._forEachChild((r) => {
          r.enable(F(w({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(F(w({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((r) => r(!1)));
    }
    _updateAncestors(t, n) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, n),
        this._parent._updateTouched({}, n));
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let r = this._cancelExistingSubscription();
        ((this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === ds || this.status === Po) && this._runAsyncValidator(r, t.emitEvent));
      }
      let n = t.sourceControl ?? this;
      (t.emitEvent !== !1 &&
        (this._events.next(new oc(this.value, n)),
        this._events.next(new Oo(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(F(w({}, t), { sourceControl: n })));
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      (this._forEachChild((n) => n._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }));
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? hs : ds;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t, n) {
      if (this.asyncValidator) {
        ((this.status = Po),
          (this._hasOwnPendingAsyncValidator = {
            emitEvent: n !== !1,
            shouldHaveEmitted: t !== !1,
          }));
        let r = aw(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((o) => {
          ((this._hasOwnPendingAsyncValidator = null),
            this.setErrors(o, { emitEvent: n, shouldHaveEmitted: t }));
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let t =
          (this._hasOwnPendingAsyncValidator?.emitEvent ||
            this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ??
          !1;
        return ((this._hasOwnPendingAsyncValidator = null), t);
      }
      return !1;
    }
    setErrors(t, n = {}) {
      ((this.errors = t),
        this._updateControlsErrors(n.emitEvent !== !1, this, n.shouldHaveEmitted));
    }
    get(t) {
      let n = t;
      return n == null || (Array.isArray(n) || (n = n.split('.')), n.length === 0)
        ? null
        : n.reduce((r, o) => r && r._find(o), this);
    }
    getError(t, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[t] : null;
    }
    hasError(t, n) {
      return !!this.getError(t, n);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t, n, r) {
      ((this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        (t || r) && this._events.next(new Oo(this.status, n)),
        this._parent && this._parent._updateControlsErrors(t, n, r));
    }
    _initObservables() {
      ((this.valueChanges = new T()), (this.statusChanges = new T()));
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? hs
        : this.errors
          ? ec
          : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Po)
            ? Po
            : this._anyControlsHaveStatus(ec)
              ? ec
              : ds;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((n) => n.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t, n) {
      let r = !this._anyControlsDirty(),
        o = this.pristine !== r;
      ((this.pristine = r),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
        o && this._events.next(new ps(this.pristine, n)));
    }
    _updateTouched(t = {}, n) {
      ((this.touched = this._anyControlsTouched()),
        this._events.next(new gs(this.touched, n)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, n));
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      cc(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let n = this._parent && this._parent.dirty;
      return !t && !!n && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      ((this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = xC(this._rawValidators)));
    }
    _assignAsyncValidators(t) {
      ((this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = MC(this._rawAsyncValidators)));
    }
  },
  sc = class extends ic {
    constructor(t, n, r) {
      (super(pw(n), gw(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }));
    }
    controls;
    registerControl(t, n) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(t, n, r = {}) {
      (this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange());
    }
    removeControl(t, n = {}) {
      (this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange());
    }
    setControl(t, n, r = {}) {
      (this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        n && this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange());
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, n = {}) {
      (DC(this, !0, t),
        Object.keys(t).forEach((r) => {
          (CC(this, !0, r),
            this.controls[r].setValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent }));
        }),
        this.updateValueAndValidity(n));
    }
    patchValue(t, n = {}) {
      t != null &&
        (Object.keys(t).forEach((r) => {
          let o = this.controls[r];
          o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = {}, n = {}) {
      (this._forEachChild((r, o) => {
        r.reset(t ? t[o] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n));
    }
    getRawValue() {
      return this._reduceChildren({}, (t, n, r) => ((t[r] = n.getRawValue()), t));
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (n, r) => (r._syncPendingControls() ? !0 : n));
      return (t && this.updateValueAndValidity({ onlySelf: !0 }), t);
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && t(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        (t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange));
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [n, r] of Object.entries(this.controls)) if (this.contains(n) && t(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n),
      );
    }
    _reduceChildren(t, n) {
      let r = t;
      return (
        this._forEachChild((o, i) => {
          r = n(r, o, i);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls)) if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var Vp = new _('', { providedIn: 'root', factory: () => Hp }),
  Hp = 'always';
function bC(e, t) {
  return [...t.path, e];
}
function fw(e, t, n = Hp) {
  (vw(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === 'always') && t.valueAccessor.setDisabledState?.(e.disabled),
    SC(e, t),
    TC(e, t),
    IC(e, t),
    EC(e, t));
}
function Xv(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t);
  });
}
function EC(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r);
    };
    (e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n);
      }));
  }
}
function vw(e, t) {
  let n = kC(e);
  t.validator !== null
    ? e.setValidators(Yv(n, t.validator))
    : typeof n == 'function' && e.setValidators([n]);
  let r = yC(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(Yv(r, t.asyncValidator))
    : typeof r == 'function' && e.setAsyncValidators([r]);
  let o = () => e.updateValueAndValidity();
  (Xv(t._rawValidators, o), Xv(t._rawAsyncValidators, o));
}
function SC(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    ((e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === 'change' && ww(e, t));
  });
}
function IC(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    ((e._pendingTouched = !0),
      e.updateOn === 'blur' && e._pendingChange && ww(e, t),
      e.updateOn !== 'submit' && e.markAsTouched());
  });
}
function ww(e, t) {
  (e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1));
}
function TC(e, t) {
  let n = (r, o) => {
    (t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r));
  };
  (e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    }));
}
function AC(e, t) {
  (e == null, vw(e, t));
}
function RC(e, t) {
  if (!e.hasOwnProperty('model')) return !1;
  let n = e.model;
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue);
}
function PC(e) {
  return Object.getPrototypeOf(e.constructor) === Bp;
}
function OC(e, t) {
  (e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === 'submit' &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    }));
}
function NC(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let n, r, o;
  return (
    t.forEach((i) => {
      i.constructor === lc ? (n = i) : PC(i) ? (r = i) : (o = i);
    }),
    o || r || n || null
  );
}
var jC = { provide: No, useExisting: Mt(() => Up) },
  us = Promise.resolve(),
  Up = (() => {
    class e extends No {
      callSetDisabledState;
      get submitted() {
        return Ce(this.submittedReactive);
      }
      _submitted = ue(() => this.submittedReactive());
      submittedReactive = W(!1);
      _directives = new Set();
      form;
      ngSubmit = new T();
      options;
      constructor(n, r, o) {
        (super(), (this.callSetDisabledState = o), (this.form = new sc({}, Lp(n), Fp(r))));
      }
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      get controls() {
        return this.form.controls;
      }
      addControl(n) {
        us.then(() => {
          let r = this._findContainer(n.path);
          ((n.control = r.registerControl(n.name, n.control)),
            fw(n.control, n, this.callSetDisabledState),
            n.control.updateValueAndValidity({ emitEvent: !1 }),
            this._directives.add(n));
        });
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        us.then(() => {
          let r = this._findContainer(n.path);
          (r && r.removeControl(n.name), this._directives.delete(n));
        });
      }
      addFormGroup(n) {
        us.then(() => {
          let r = this._findContainer(n.path),
            o = new sc({});
          (AC(o, n), r.registerControl(n.name, o), o.updateValueAndValidity({ emitEvent: !1 }));
        });
      }
      removeFormGroup(n) {
        us.then(() => {
          let r = this._findContainer(n.path);
          r && r.removeControl(n.name);
        });
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        us.then(() => {
          this.form.get(n.path).setValue(r);
        });
      }
      setValue(n) {
        this.control.setValue(n);
      }
      onSubmit(n) {
        return (
          this.submittedReactive.set(!0),
          OC(this.form, this._directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Np(this.control)),
          n?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        (this.form.reset(n),
          this.submittedReactive.set(!1),
          this.form._events.next(new jp(this.form)));
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.form._updateOn = this.options.updateOn);
      }
      _findContainer(n) {
        return (n.pop(), n.length ? this.form.get(n) : this.form);
      }
      static ɵfac = function (r) {
        return new (r || e)(I(ow, 10), I(iw, 10), I(Vp, 8));
      };
      static ɵdir = oe({
        type: e,
        selectors: [
          ['form', 3, 'ngNoForm', '', 3, 'formGroup', ''],
          ['ng-form'],
          ['', 'ngForm', ''],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            S('submit', function (s) {
              return o.onSubmit(s);
            })('reset', function () {
              return o.onReset();
            });
        },
        inputs: { options: [0, 'ngFormOptions', 'options'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        standalone: !1,
        features: [qe([jC]), ft],
      });
    }
    return e;
  })();
function Jv(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function ew(e) {
  return (
    typeof e == 'object' &&
    e !== null &&
    Object.keys(e).length === 2 &&
    'value' in e &&
    'disabled' in e
  );
}
var BC = class extends ic {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = !1;
  constructor(t = null, n, r) {
    (super(pw(n), gw(r, n)),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
      cc(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (ew(t) ? (this.defaultValue = t.value) : (this.defaultValue = t)));
  }
  setValue(t, n = {}) {
    ((this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) => r(this.value, n.emitViewToModelChange !== !1)),
      this.updateValueAndValidity(n));
  }
  patchValue(t, n = {}) {
    this.setValue(t, n);
  }
  reset(t = this.defaultValue, n = {}) {
    (this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1));
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    Jv(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    Jv(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, { onlySelf: !0, emitModelToViewChange: !1 }), !0)
      : !1;
  }
  _applyFormState(t) {
    ew(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var LC = { provide: fs, useExisting: Mt(() => zp) },
  tw = Promise.resolve(),
  zp = (() => {
    class e extends fs {
      _changeDetectorRef;
      callSetDisabledState;
      control = new BC();
      static ngAcceptInputType_isDisabled;
      _registered = !1;
      viewModel;
      name = '';
      isDisabled;
      model;
      options;
      update = new T();
      constructor(n, r, o, i, s, a) {
        (super(),
          (this._changeDetectorRef = s),
          (this.callSetDisabledState = a),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o),
          (this.valueAccessor = NC(this, i)));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || 'name' in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let r = n.name.previousValue;
            this.formDirective.removeControl({ name: r, path: this._getPath(r) });
          }
          this._setUpControl();
        }
        ('isDisabled' in n && this._updateDisabled(n),
          RC(n, this.viewModel) && (this._updateValue(this.model), (this.viewModel = this.model)));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        ((this.viewModel = n), this.update.emit(n));
      }
      _setUpControl() {
        (this._setUpdateStrategy(),
          this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this),
          (this._registered = !0));
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        (fw(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 }));
      }
      _checkForErrors() {
        this._checkName();
      }
      _checkName() {
        (this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name);
      }
      _updateValue(n) {
        tw.then(() => {
          (this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck());
        });
      }
      _updateDisabled(n) {
        let r = n.isDisabled.currentValue,
          o = r !== 0 && et(r);
        tw.then(() => {
          (o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck());
        });
      }
      _getPath(n) {
        return this._parent ? bC(n, this._parent) : [n];
      }
      static ɵfac = function (r) {
        return new (r || e)(I(No, 9), I(ow, 10), I(iw, 10), I(ac, 10), I(wt, 8), I(Vp, 8));
      };
      static ɵdir = oe({
        type: e,
        selectors: [['', 'ngModel', '', 3, 'formControlName', '', 3, 'formControl', '']],
        inputs: {
          name: 'name',
          isDisabled: [0, 'disabled', 'isDisabled'],
          model: [0, 'ngModel', 'model'],
          options: [0, 'ngModelOptions', 'options'],
        },
        outputs: { update: 'ngModelChange' },
        exportAs: ['ngModel'],
        standalone: !1,
        features: [qe([LC]), ft, Et],
      });
    }
    return e;
  })();
var mw = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵdir = oe({
      type: e,
      selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
      hostAttrs: ['novalidate', ''],
      standalone: !1,
    });
  }
  return e;
})();
var FC = { provide: ac, useExisting: Mt(() => dc), multi: !0 };
function kw(e, t) {
  return e == null
    ? `${t}`
    : (t && typeof t == 'object' && (t = 'Object'), `${e}: ${t}`.slice(0, 50));
}
function VC(e) {
  return e.split(':')[0];
}
var dc = (() => {
    class e extends Bp {
      value;
      _optionMap = new Map();
      _idCounter = 0;
      set compareWith(n) {
        this._compareWith = n;
      }
      _compareWith = Object.is;
      appRefInjector = u(vt).injector;
      destroyRef = u(ht);
      cdr = u(wt);
      _queuedWrite = !1;
      _writeValueAfterRender() {
        this._queuedWrite ||
          this.appRefInjector.destroyed ||
          ((this._queuedWrite = !0),
          vr(
            {
              write: () => {
                this.destroyRef.destroyed ||
                  ((this._queuedWrite = !1), this.writeValue(this.value));
              },
            },
            { injector: this.appRefInjector },
          ));
      }
      writeValue(n) {
        (this.cdr.markForCheck(), (this.value = n));
        let r = this._getOptionId(n),
          o = kw(r, n);
        this.setProperty('value', o);
      }
      registerOnChange(n) {
        this.onChange = (r) => {
          ((this.value = this._getOptionValue(r)), n(this.value));
        };
      }
      _registerOption() {
        return (this._idCounter++).toString();
      }
      _getOptionId(n) {
        for (let r of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(r), n)) return r;
        return null;
      }
      _getOptionValue(n) {
        let r = VC(n);
        return this._optionMap.has(r) ? this._optionMap.get(r) : n;
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Tn(e)))(o || e);
        };
      })();
      static ɵdir = oe({
        type: e,
        selectors: [
          ['select', 'formControlName', '', 3, 'multiple', ''],
          ['select', 'formControl', '', 3, 'multiple', ''],
          ['select', 'ngModel', '', 3, 'multiple', ''],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            S('change', function (s) {
              return o.onChange(s.target.value);
            })('blur', function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: 'compareWith' },
        standalone: !1,
        features: [qe([FC]), ft],
      });
    }
    return e;
  })(),
  yw = (() => {
    class e {
      _element;
      _renderer;
      _select;
      id;
      constructor(n, r, o) {
        ((this._element = n),
          (this._renderer = r),
          (this._select = o),
          this._select && (this.id = this._select._registerOption()));
      }
      set ngValue(n) {
        this._select != null &&
          (this._select._optionMap.set(this.id, n),
          this._setElementValue(kw(this.id, n)),
          this._select._writeValueAfterRender());
      }
      set value(n) {
        (this._setElementValue(n), this._select && this._select._writeValueAfterRender());
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, 'value', n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id), this._select._writeValueAfterRender());
      }
      static ɵfac = function (r) {
        return new (r || e)(I(ge), I(pt), I(dc, 9));
      };
      static ɵdir = oe({
        type: e,
        selectors: [['option']],
        inputs: { ngValue: 'ngValue', value: 'value' },
        standalone: !1,
      });
    }
    return e;
  })(),
  HC = { provide: ac, useExisting: Mt(() => _w), multi: !0 };
function nw(e, t) {
  return e == null
    ? `${t}`
    : (typeof t == 'string' && (t = `'${t}'`),
      t && typeof t == 'object' && (t = 'Object'),
      `${e}: ${t}`.slice(0, 50));
}
function UC(e) {
  return e.split(':')[0];
}
var _w = (() => {
    class e extends Bp {
      value;
      _optionMap = new Map();
      _idCounter = 0;
      set compareWith(n) {
        this._compareWith = n;
      }
      _compareWith = Object.is;
      writeValue(n) {
        this.value = n;
        let r;
        if (Array.isArray(n)) {
          let o = n.map((i) => this._getOptionId(i));
          r = (i, s) => {
            i._setSelected(o.indexOf(s.toString()) > -1);
          };
        } else
          r = (o, i) => {
            o._setSelected(!1);
          };
        this._optionMap.forEach(r);
      }
      registerOnChange(n) {
        this.onChange = (r) => {
          let o = [],
            i = r.selectedOptions;
          if (i !== void 0) {
            let s = i;
            for (let a = 0; a < s.length; a++) {
              let l = s[a],
                c = this._getOptionValue(l.value);
              o.push(c);
            }
          } else {
            let s = r.options;
            for (let a = 0; a < s.length; a++) {
              let l = s[a];
              if (l.selected) {
                let c = this._getOptionValue(l.value);
                o.push(c);
              }
            }
          }
          ((this.value = o), n(o));
        };
      }
      _registerOption(n) {
        let r = (this._idCounter++).toString();
        return (this._optionMap.set(r, n), r);
      }
      _getOptionId(n) {
        for (let r of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(r)._value, n)) return r;
        return null;
      }
      _getOptionValue(n) {
        let r = UC(n);
        return this._optionMap.has(r) ? this._optionMap.get(r)._value : n;
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = Tn(e)))(o || e);
        };
      })();
      static ɵdir = oe({
        type: e,
        selectors: [
          ['select', 'multiple', '', 'formControlName', ''],
          ['select', 'multiple', '', 'formControl', ''],
          ['select', 'multiple', '', 'ngModel', ''],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            S('change', function (s) {
              return o.onChange(s.target);
            })('blur', function () {
              return o.onTouched();
            });
        },
        inputs: { compareWith: 'compareWith' },
        standalone: !1,
        features: [qe([HC]), ft],
      });
    }
    return e;
  })(),
  xw = (() => {
    class e {
      _element;
      _renderer;
      _select;
      id;
      _value;
      constructor(n, r, o) {
        ((this._element = n),
          (this._renderer = r),
          (this._select = o),
          this._select && (this.id = this._select._registerOption(this)));
      }
      set ngValue(n) {
        this._select != null &&
          ((this._value = n),
          this._setElementValue(nw(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._select
          ? ((this._value = n),
            this._setElementValue(nw(this.id, n)),
            this._select.writeValue(this._select.value))
          : this._setElementValue(n);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, 'value', n);
      }
      _setSelected(n) {
        this._renderer.setProperty(this._element.nativeElement, 'selected', n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id), this._select.writeValue(this._select.value));
      }
      static ɵfac = function (r) {
        return new (r || e)(I(ge), I(pt), I(_w, 9));
      };
      static ɵdir = oe({
        type: e,
        selectors: [['option']],
        inputs: { ngValue: 'ngValue', value: 'value' },
        standalone: !1,
      });
    }
    return e;
  })();
var zC = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Fe({ type: e });
    static ɵinj = Pe({});
  }
  return e;
})();
var Mw = (() => {
  class e {
    static withConfig(n) {
      return { ngModule: e, providers: [{ provide: Vp, useValue: n.callSetDisabledState ?? Hp }] };
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Fe({ type: e });
    static ɵinj = Pe({ imports: [zC] });
  }
  return e;
})();
var Cw = (e) => {
  if (!e) return [];
  let t = e
      .replace(/\s+/g, ' ')
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean),
    n = new Map();
  for (let r of t) {
    let o = r.match(/^(\d+)([MTN])([1-9]+)$/i);
    if (!o) continue;
    let i = o[1].split('').filter((c) => /[2-7]/.test(c)),
      s = o[2].toUpperCase(),
      a = qv(s),
      l = o[3]
        .split('')
        .map((c) => parseInt(c, 10))
        .filter((c) => c >= 1 && c <= a);
    if (!(!i.length || !l.length))
      for (let c of i) {
        let d = `${c}-${s}`,
          h = n.get(d) ?? { day: c, period: s, slots: new Set() };
        (l.forEach((g) => h.slots.add(g)), n.set(d, h));
      }
  }
  return Array.from(n.values()).map((r) => ({
    day: r.day,
    period: r.period,
    slots: Array.from(r.slots).sort((o, i) => o - i),
  }));
};
function Dw(e) {
  return e != null && `${e}` != 'false';
}
var Hn = class e {
  _list = W([]);
  list() {
    return this._list();
  }
  push(t, n, r) {
    let o =
        typeof crypto < 'u' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
      i,
      s = 'info',
      a = 4e3;
    typeof t == 'string'
      ? ((i = t), n && (s = n), typeof r == 'number' && (a = r))
      : ((i = t.message), t.tone && (s = t.tone), typeof t.ttl == 'number' && (a = t.ttl));
    let l = { id: o, message: i, tone: s, ttl: a };
    return (
      this._list.update((c) => [l, ...c]),
      a > 0 && window.setTimeout(() => this.dismiss(o), a),
      o
    );
  }
  dismiss(t) {
    this._list.update((n) => n.filter((r) => r.id !== t));
  }
  clear() {
    this._list.set([]);
  }
  info(t, n) {
    return this.push(t, 'info', n);
  }
  success(t, n) {
    return this.push(t, 'success', n);
  }
  warn(t, n) {
    return this.push(t, 'warn', n);
  }
  error(t, n) {
    return this.push(t, 'error', n);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
};
function GC(e, t) {
  if ((e & 1 && (f(0, 'option', 47), M(1), v()), e & 2)) {
    let n = t.$implicit;
    (A('value', n.id), m(), he(n.label));
  }
}
function qC(e, t) {
  if (e & 1) {
    let n = _e();
    (f(0, 'button', 30),
      S('click', function () {
        let o = C(n).$implicit,
          i = k(2);
        return D(i.toggleSlot(o.n));
      }),
      M(1),
      v());
  }
  if (e & 2) {
    let n = t.$implicit,
      r = k(2);
    (ie('on', r.selSlots.has(n.n)), m(), xe(' ', n.label, ' '));
  }
}
function WC(e, t) {
  if ((e & 1 && (f(0, 'span', 57), M(1), v()), e & 2)) {
    let n = t.$implicit,
      r = k().$implicit,
      o = k(3);
    (m(), xe(' ', o.hourRange(r.period, n), ' '));
  }
}
function ZC(e, t) {
  if (e & 1) {
    let n = _e();
    (f(0, 'div', 50)(1, 'div', 51)(2, 'span', 52),
      M(3),
      v(),
      f(4, 'span', 53),
      M(5),
      v()(),
      f(6, 'div', 29),
      Q(7, WC, 2, 1, 'span', 54),
      v(),
      f(8, 'button', 55),
      S('click', function () {
        let o = C(n).$implicit,
          i = k(3);
        return D(i.removeBlock(o));
      }),
      E(9, 'ng-icon', 56),
      v()());
  }
  if (e & 2) {
    let n = t.$implicit,
      r = k(3);
    (m(3),
      he(r.dayLabel(n.day)),
      m(2),
      he(n.period === 'M' ? 'Manh\xE3' : n.period === 'T' ? 'Tarde' : 'Noite'),
      m(2),
      A('ngForOf', n.slots));
  }
}
function YC(e, t) {
  if (
    (e & 1 &&
      (f(0, 'div', 21)(1, 'div', 22)(2, 'div', 23),
      M(3, 'Blocos adicionados'),
      v(),
      f(4, 'div', 48),
      Q(5, ZC, 10, 3, 'div', 49),
      v()()()),
    e & 2)
  ) {
    let n = k(2);
    (m(5), A('ngForOf', n.manual));
  }
}
function KC(e, t) {
  if (e & 1) {
    let n = _e();
    (St(0),
      f(1, 'div', 1),
      an(function () {
        return (C(n), D('fade-leave'));
      }),
      sn(function () {
        return (C(n), D('fade-enter'));
      }),
      f(2, 'div', 2),
      an(function () {
        return (C(n), D('pop-leave'));
      }),
      sn(function () {
        return (C(n), D('pop-enter'));
      }),
      f(3, 'header', 3)(4, 'h2', 4),
      M(5, 'Nova disciplina'),
      v(),
      f(6, 'button', 5),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.close.emit());
      }),
      E(7, 'ng-icon', 6),
      v()(),
      f(8, 'form', 7),
      S('ngSubmit', function () {
        C(n);
        let o = k();
        return D(o.save());
      }),
      f(9, 'div', 8)(10, 'div', 9)(11, 'label', 10),
      M(12, 'Nome'),
      v(),
      f(13, 'input', 11),
      Pn('ngModelChange', function (o) {
        C(n);
        let i = k();
        return (yr(i.name, o) || (i.name = o), D(o));
      }),
      v()(),
      f(14, 'div', 9)(15, 'label', 12),
      M(16, 'Professor(a)'),
      v(),
      f(17, 'input', 13),
      Pn('ngModelChange', function (o) {
        C(n);
        let i = k();
        return (yr(i.teacher, o) || (i.teacher = o), D(o));
      }),
      v()(),
      f(18, 'div', 9)(19, 'label', 14),
      M(20, 'Tipo'),
      v(),
      f(21, 'select', 15),
      Pn('ngModelChange', function (o) {
        C(n);
        let i = k();
        return (yr(i.typeId, o) || (i.typeId = o), D(o));
      }),
      Q(22, GC, 2, 2, 'option', 16),
      v()(),
      f(23, 'div', 9)(24, 'label', 17),
      M(25, 'C\xF3digo de hor\xE1rio '),
      f(26, 'span', 18),
      M(27, '(opcional)'),
      v()(),
      f(28, 'input', 19),
      Pn('ngModelChange', function (o) {
        C(n);
        let i = k();
        return (yr(i.code, o) || (i.code = o), D(o));
      }),
      v()(),
      f(29, 'div', 20)(30, 'span'),
      M(31, 'ou'),
      v()(),
      f(32, 'div', 21)(33, 'div', 22)(34, 'div', 23),
      M(35, 'Per\xEDodo'),
      v(),
      f(36, 'div', 24)(37, 'button', 25),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.selPeriod.set('M'));
      }),
      E(38, 'ng-icon', 26),
      M(39, ' Manh\xE3 '),
      v(),
      f(40, 'button', 25),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.selPeriod.set('T'));
      }),
      E(41, 'ng-icon', 27),
      M(42, ' Tarde '),
      v(),
      f(43, 'button', 25),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.selPeriod.set('N'));
      }),
      E(44, 'ng-icon', 28),
      M(45, ' Noite '),
      v()()()(),
      f(46, 'div', 21)(47, 'div', 22)(48, 'div', 23),
      M(49, 'Dias'),
      v(),
      f(50, 'div', 29)(51, 'button', 30),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.toggleDay('2'));
      }),
      M(52),
      v(),
      f(53, 'button', 30),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.toggleDay('3'));
      }),
      M(54),
      v(),
      f(55, 'button', 30),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.toggleDay('4'));
      }),
      M(56),
      v(),
      f(57, 'button', 30),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.toggleDay('5'));
      }),
      M(58),
      v(),
      f(59, 'button', 30),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.toggleDay('6'));
      }),
      M(60),
      v(),
      f(61, 'button', 30),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.toggleDay('7'));
      }),
      M(62),
      v()()()(),
      f(63, 'div', 21)(64, 'div', 22)(65, 'div', 23),
      M(66, 'Hor\xE1rios'),
      v(),
      f(67, 'div', 31),
      Q(68, qC, 2, 3, 'button', 32),
      v(),
      f(69, 'div', 33)(70, 'button', 34),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.clearCurrent());
      }),
      E(71, 'ng-icon', 35),
      M(72, ' Limpar sele\xE7\xE3o '),
      v(),
      f(73, 'button', 36),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.addBlock());
      }),
      E(74, 'ng-icon', 37),
      M(75, ' Adicionar bloco '),
      v()()()(),
      Q(76, YC, 6, 1, 'div', 38),
      f(77, 'div', 39)(78, 'label', 40),
      M(79, 'Descri\xE7\xE3o'),
      v(),
      f(80, 'textarea', 41),
      Pn('ngModelChange', function (o) {
        C(n);
        let i = k();
        return (yr(i.description, o) || (i.description = o), D(o));
      }),
      v()()()(),
      f(81, 'footer', 42)(82, 'button', 34),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.close.emit());
      }),
      E(83, 'ng-icon', 43),
      M(84, ' Cancelar '),
      v(),
      f(85, 'button', 34),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.onDownload());
      }),
      E(86, 'ng-icon', 44),
      M(87, ' Baixar '),
      v(),
      f(88, 'button', 45),
      E(89, 'ng-icon', 46),
      M(90, ' Salvar '),
      v()()()(),
      It());
  }
  if (e & 2) {
    let n = k();
    (m(13),
      Rn('ngModel', n.name),
      m(4),
      Rn('ngModel', n.teacher),
      m(4),
      Rn('ngModel', n.typeId),
      m(),
      A('ngForOf', n.store.types()),
      m(6),
      Rn('ngModel', n.code),
      m(9),
      ie('active', n.selPeriod() === 'M'),
      m(3),
      ie('active', n.selPeriod() === 'T'),
      m(3),
      ie('active', n.selPeriod() === 'N'),
      m(8),
      ie('on', n.selDays.has('2')),
      m(),
      xe(' ', n.dayLabel('2'), ' '),
      m(),
      ie('on', n.selDays.has('3')),
      m(),
      xe(' ', n.dayLabel('3'), ' '),
      m(),
      ie('on', n.selDays.has('4')),
      m(),
      xe(' ', n.dayLabel('4'), ' '),
      m(),
      ie('on', n.selDays.has('5')),
      m(),
      xe(' ', n.dayLabel('5'), ' '),
      m(),
      ie('on', n.selDays.has('6')),
      m(),
      xe(' ', n.dayLabel('6'), ' '),
      m(),
      ie('on', n.selDays.has('7')),
      m(),
      xe(' ', n.dayLabel('7'), ' '),
      m(6),
      A('ngForOf', n.slotOptions()),
      m(8),
      A('ngIf', n.manual.length),
      m(4),
      Rn('ngModel', n.description),
      m(8),
      A('disabled', !n.manual.length && (!n.selDays.size || !n.selSlots.size) && !n.code));
  }
}
var hc = class e {
  constructor(t, n) {
    this.store = t;
    this.toast = n;
  }
  visible = !1;
  set open(t) {
    this.visible = Dw(t);
  }
  id = null;
  initial = null;
  close = new T();
  download = new T();
  name = '';
  teacher = '';
  description = '';
  typeId = 'obg';
  code = '';
  selPeriod = W('M');
  selDays = new Set();
  selSlots = new Set();
  manual = [];
  ngOnChanges(t) {
    ((t.open && this.visible) || t.initial) && this.initial && this.loadFromInitial(this.initial);
  }
  loadFromInitial(t) {
    ((this.id = t.id ?? null),
      (this.name = t.name ?? ''),
      (this.teacher = t.teacher ?? ''),
      (this.description = t.description ?? ''),
      (this.typeId = t.typeId ?? 'obg'),
      (this.code = ''),
      (this.manual = (t.meetings ?? []).map((n) => ({
        day: n.day,
        period: n.period,
        slots: [...n.slots].sort((r, o) => r - o),
      }))),
      this.selDays.clear(),
      this.selSlots.clear(),
      this.selPeriod.set('M'));
  }
  hourRange(t, n) {
    let [r, o] = rt(t, n);
    return `${Ot(r)}\u2013${Ot(o)}`;
  }
  slotOptions = ue(() => {
    let t = this.selPeriod(),
      n = t === 'T' ? 6 : 5;
    return Array.from({ length: n }, (r, o) => {
      let i = o + 1,
        [s, a] = rt(t, i);
      return { n: i, label: `${Ot(s)}\u2013${Ot(a)}` };
    });
  });
  dayLabel(t) {
    return Ao[t] ?? t;
  }
  toggleDay(t) {
    this.selDays.has(t) ? this.selDays.delete(t) : this.selDays.add(t);
  }
  pendingFromUI() {
    if (!this.selDays.size || !this.selSlots.size) return [];
    let t = Array.from(this.selSlots).sort((r, o) => r - o),
      n = this.selPeriod();
    return Array.from(this.selDays).map((r) => ({ day: r, period: n, slots: t }));
  }
  toggleSlot(t) {
    this.selSlots.has(t) ? this.selSlots.delete(t) : this.selSlots.add(t);
  }
  clearCurrent() {
    (this.selDays.clear(), this.selSlots.clear());
  }
  addBlock() {
    if (!this.selDays.size || !this.selSlots.size) {
      this.toast.push('Escolha dias e hor\xE1rios antes de adicionar.', 'warn');
      return;
    }
    let t = Array.from(this.selSlots).sort((n, r) => n - r);
    for (let n of this.selDays) this.upsertMeeting({ day: n, period: this.selPeriod(), slots: t });
    (this.clearCurrent(), this.toast.push('Bloco adicionado.', 'success'));
  }
  removeBlock(t) {
    this.manual = this.manual.filter((n) => !(n.day === t.day && n.period === t.period));
  }
  upsertMeeting(t) {
    let n = this.manual.find((o) => o.day === t.day && o.period === t.period);
    if (!n) {
      this.manual = [...this.manual, w({}, t)];
      return;
    }
    let r = Array.from(new Set([...n.slots, ...t.slots])).sort((o, i) => o - i);
    ((n.slots = r), (this.manual = [...this.manual]));
  }
  fromCode() {
    let t = this.code?.trim();
    return t ? Cw(t) : [];
  }
  mergeMeetings(t, n) {
    let r = (i) => `${i.day}-${i.period}`,
      o = new Map();
    for (let i of [...t, ...n]) {
      let s = r(i),
        a = o.get(s);
      a
        ? (a.slots = Array.from(new Set([...a.slots, ...i.slots])).sort((l, c) => l - c))
        : o.set(s, { day: i.day, period: i.period, slots: [...i.slots].sort((l, c) => l - c) });
    }
    return Array.from(o.values());
  }
  resetForm() {
    ((this.id = null),
      (this.name = ''),
      (this.teacher = ''),
      (this.description = ''),
      (this.typeId = 'obg'),
      (this.code = ''),
      (this.manual = []),
      this.selDays.clear(),
      this.selSlots.clear(),
      this.selPeriod.set('M'));
  }
  save() {
    let t = this.mergeMeetings([...this.manual, ...this.pendingFromUI()], this.fromCode());
    if (!t.length) {
      this.toast.push('Selecione ao menos um hor\xE1rio ou insira um c\xF3digo v\xE1lido.', 'warn');
      return;
    }
    (this.id || (this.id = crypto.randomUUID()),
      this.store.upsertCourse({
        id: this.id,
        name: this.name,
        teacher: this.teacher || void 0,
        description: this.description || void 0,
        typeId: this.typeId,
        meetings: t,
      }),
      this.toast.push('Disciplina salva com sucesso.', 'success'),
      this.close.emit(),
      this.resetForm());
  }
  onDownload() {
    let t = this.mergeMeetings([...this.manual, ...this.pendingFromUI()], this.fromCode()),
      n = {
        id: this.id ?? void 0,
        name: this.name || 'Disciplina',
        teacher: this.teacher || void 0,
        description: this.description || void 0,
        typeId: this.typeId,
        meetings: t,
      };
    this.download.emit(n);
  }
  static ɵfac = function (n) {
    return new (n || e)(I(We), I(Hn));
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-course-modal']],
    inputs: { open: 'open', id: 'id', initial: 'initial' },
    outputs: { close: 'close', download: 'download' },
    features: [Et, bi()],
    decls: 1,
    vars: 1,
    consts: [
      [4, 'ngIf'],
      [1, 'modal-backdrop'],
      ['role', 'dialog', 'aria-modal', 'true', 'aria-labelledby', 'course-modal-title', 1, 'modal'],
      [1, 'head'],
      ['id', 'course-modal-title'],
      ['type', 'button', 'aria-label', 'Cancelar', 1, 'icon-btn', 3, 'click'],
      ['name', 'lucideX', 1, 'icon-18'],
      ['id', 'course-modal-form', 1, 'body', 3, 'ngSubmit'],
      [1, 'grid2'],
      [1, 'field'],
      ['for', 'cm-name'],
      [
        'id',
        'cm-name',
        'name',
        'name',
        'placeholder',
        'Ex.: Bioqu\xEDmica',
        'autocomplete',
        'off',
        3,
        'ngModelChange',
        'ngModel',
      ],
      ['for', 'cm-teacher'],
      [
        'id',
        'cm-teacher',
        'name',
        'teacher',
        'placeholder',
        'Opcional',
        'autocomplete',
        'off',
        3,
        'ngModelChange',
        'ngModel',
      ],
      ['for', 'cm-type'],
      ['id', 'cm-type', 'name', 'typeId', 3, 'ngModelChange', 'ngModel'],
      [3, 'value', 4, 'ngFor', 'ngForOf'],
      ['for', 'cm-code'],
      [1, 'muted'],
      [
        'id',
        'cm-code',
        'name',
        'code',
        'placeholder',
        'Ex.: 23M123',
        'spellcheck',
        'false',
        'inputmode',
        'text',
        3,
        'ngModelChange',
        'ngModel',
      ],
      [1, 'full-row', 'hr-or'],
      [1, 'full-row'],
      [1, 'group'],
      [1, 'group-title'],
      [1, 'segmented'],
      ['type', 'button', 1, 'seg', 3, 'click'],
      ['name', 'lucideSun', 1, 'icon-16'],
      ['name', 'lucideSunset', 1, 'icon-16'],
      ['name', 'lucideMoon', 1, 'icon-16'],
      [1, 'chips'],
      ['type', 'button', 1, 'chip', 3, 'click'],
      [1, 'chips', 'scroll-x'],
      ['type', 'button', 'class', 'chip', 3, 'on', 'click', 4, 'ngFor', 'ngForOf'],
      [1, 'group-actions'],
      ['type', 'button', 1, 'btn-ghost', 3, 'click'],
      ['name', 'lucideEraser', 1, 'icon-16'],
      ['type', 'button', 1, 'btn', 3, 'click'],
      ['name', 'lucidePlus', 1, 'icon-16'],
      ['class', 'full-row', 4, 'ngIf'],
      [1, 'field', 'full-row'],
      ['for', 'cm-desc'],
      [
        'id',
        'cm-desc',
        'name',
        'description',
        'rows',
        '3',
        'placeholder',
        'Opcional',
        3,
        'ngModelChange',
        'ngModel',
      ],
      [1, 'foot'],
      ['name', 'lucideX', 1, 'icon-16'],
      ['name', 'lucideDownload', 1, 'icon-16'],
      ['type', 'submit', 'form', 'course-modal-form', 1, 'btn', 3, 'disabled'],
      ['name', 'lucideSave', 1, 'icon-16'],
      [3, 'value'],
      [1, 'added'],
      ['class', 'added-item', 4, 'ngFor', 'ngForOf'],
      [1, 'added-item'],
      [1, 'added-head'],
      [1, 'added-day'],
      [1, 'added-per'],
      ['class', 'chip', 4, 'ngFor', 'ngForOf'],
      ['type', 'button', 'aria-label', 'Remover', 1, 'icon-btn', 'sm', 3, 'click'],
      ['name', 'lucideTrash2', 1, 'icon-16'],
      [1, 'chip'],
    ],
    template: function (n, r) {
      (n & 1 && Q(0, KC, 91, 33, 'ng-container', 0), n & 2 && A('ngIf', r.visible));
    },
    dependencies: [ve, Wt, Ve, Mw, mw, yw, xw, lc, dc, hw, uw, zp, Up, je],
    styles: [
      '@charset "UTF-8";[_nghost-%COMP%]{display:contents}.modal[_ngcontent-%COMP%]{z-index:100;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg, 20px);width:min(720px,92vw);box-shadow:var(--shadow-2);display:grid;grid-template-rows:auto 1fr auto;overflow:hidden}.modal-backdrop[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:2147483647;background:#00000073;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);display:grid;place-items:center}.modal[_ngcontent-%COMP%]{z-index:1}.head[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);background:color-mix(in oklab,var(--surface) 96%,transparent)}.head[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0;font-size:16px;font-weight:700}.icon-btn[_ngcontent-%COMP%]{display:grid;place-items:center;width:32px;height:32px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2, #171a27);color:var(--muted);transition:transform .12s var(--ease-out-3, cubic-bezier(.22, .61, .36, 1)),background .12s}.icon-btn[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.icon-btn[_ngcontent-%COMP%]:focus-visible{outline:0;box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 40%,transparent)}.body[_ngcontent-%COMP%]{padding:16px}.grid2[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.full-row[_ngcontent-%COMP%]{grid-column:1/-1}.foot[_ngcontent-%COMP%]{display:flex;gap:8px;justify-content:flex-end;padding:12px 16px;border-top:1px solid var(--border);background:color-mix(in oklab,var(--surface-2, #171a27) 96%,transparent)}.btn[_ngcontent-%COMP%]{background:var(--primary);color:#fff;border:1px solid var(--primary-ring);border-radius:var(--radius-sm, 12px);padding:10px 14px;transition:transform .12s var(--ease-out-3, cubic-bezier(.22, .61, .36, 1)),box-shadow .12s}.btn[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.btn[_ngcontent-%COMP%]:focus-visible{outline:0;box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 35%,transparent)}.btn-ghost[_ngcontent-%COMP%]{background:var(--surface-2, #171a27);color:var(--txt);border:1px solid var(--border);border-radius:var(--radius-sm, 12px);padding:10px 14px;transition:transform .12s var(--ease-out-3, cubic-bezier(.22, .61, .36, 1))}.btn-ghost[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.hr-or[_ngcontent-%COMP%]{position:relative;display:grid;place-items:center;height:28px;margin:4px 0}.hr-or[_ngcontent-%COMP%]:before{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px dashed var(--border)}.hr-or[_ngcontent-%COMP%] > span[_ngcontent-%COMP%]{position:relative;z-index:1;padding:0 8px;color:var(--muted);font-size:12px;background:var(--surface);border-radius:8px;border:1px solid var(--border)}.group[_ngcontent-%COMP%]{display:grid;gap:8px}.group-title[_ngcontent-%COMP%]{color:var(--muted);font-size:12px}.segmented[_ngcontent-%COMP%]{display:inline-flex;gap:6px;padding:4px;border:1px solid var(--border);border-radius:999px;background:var(--surface-2)}.seg[_ngcontent-%COMP%]{padding:6px 12px;border-radius:999px;border:1px solid transparent;background:transparent;color:var(--txt);transition:transform .12s ease,background .12s ease}.seg.active[_ngcontent-%COMP%]{background:color-mix(in oklab,var(--primary) 16%,transparent);border-color:color-mix(in oklab,var(--primary) 45%,var(--border))}.seg[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.chips[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:8px}.chip[_ngcontent-%COMP%]{padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);font-size:12px;color:var(--txt);transition:transform .12s ease,background .12s ease,border-color .12s ease}.chip.on[_ngcontent-%COMP%]{background:color-mix(in oklab,var(--primary) 16%,transparent);border-color:color-mix(in oklab,var(--primary) 45%,var(--border))}.chip[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.scroll-x[_ngcontent-%COMP%]{overflow-x:auto;padding-bottom:2px}.group-actions[_ngcontent-%COMP%]{display:flex;gap:8px;margin-top:6px}.added[_ngcontent-%COMP%]{display:grid;gap:8px}.added-item[_ngcontent-%COMP%]{position:relative;border:1px solid var(--border);border-radius:12px;padding:10px 40px 10px 10px;background:color-mix(in oklab,var(--surface-2) 80%,transparent)}.added-head[_ngcontent-%COMP%]{display:flex;gap:8px;margin-bottom:6px}.added-day[_ngcontent-%COMP%]{font-weight:700}.added-per[_ngcontent-%COMP%]{color:var(--muted)}.icon-btn.sm[_ngcontent-%COMP%]{width:28px;height:28px;position:absolute;top:8px;right:8px}@media (max-width: 700px){.grid2[_ngcontent-%COMP%]{grid-template-columns:1fr}}.modal[_ngcontent-%COMP%]{position:relative;width:min(840px,94vw);max-height:92vh;overflow:auto;border-radius:20px;border:1px solid var(--border);background:color-mix(in oklab,var(--surface) 96%,transparent);box-shadow:var(--shadow-3, 0 18px 60px rgba(0, 0, 0, .35))}@supports (height: 100dvh){.modal[_ngcontent-%COMP%]{max-height:calc(100dvh - 32px)}}@supports (height: 100svh){.modal[_ngcontent-%COMP%]{max-height:calc(100svh - 32px)}}.body[_ngcontent-%COMP%]{padding:16px;overflow:auto;min-height:0;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;scrollbar-gutter:stable}.modal-backdrop[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:clamp(8px,2vh,24px);background:#00000073;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
    ],
  });
};
function QC(e, t) {
  if ((e & 1 && (f(0, 'div', 21), E(1, 'ng-icon', 22), f(2, 'span'), M(3), v()()), e & 2)) {
    let n = k(2);
    (m(3), he(n.data.teacher));
  }
}
function XC(e, t) {
  if ((e & 1 && (f(0, 'span', 28), E(1, 'ng-icon', 29), M(2), v()), e & 2)) {
    let n = t.$implicit;
    (m(2), xe('', n, ' '));
  }
}
function JC(e, t) {
  if (
    (e & 1 && (f(0, 'div', 25)(1, 'span', 26), M(2), v(), Q(3, XC, 3, 1, 'span', 27), v()), e & 2)
  ) {
    let n = t.$implicit;
    (m(2), he(n.day), m(), A('ngForOf', n.ranges));
  }
}
function e8(e, t) {
  if ((e & 1 && (f(0, 'div', 23), Q(1, JC, 4, 2, 'div', 24), v()), e & 2)) {
    let n = k(2);
    (m(), A('ngForOf', n.chips()));
  }
}
function t8(e, t) {
  if ((e & 1 && (f(0, 'p', 30), M(1), v()), e & 2)) {
    let n = k(2);
    (m(), he(n.data.description));
  }
}
function n8(e, t) {
  if (e & 1) {
    let n = _e();
    (St(0),
      f(1, 'div', 1)(2, 'div', 2),
      E(3, 'div', 3),
      f(4, 'header', 4)(5, 'span', 5),
      M(6),
      v(),
      f(7, 'button', 6),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.close.emit());
      }),
      E(8, 'ng-icon', 7),
      v()(),
      f(9, 'main', 8)(10, 'h2', 9),
      M(11),
      v(),
      Q(12, QC, 4, 1, 'div', 10)(13, e8, 2, 1, 'div', 11)(14, t8, 2, 1, 'p', 12),
      v(),
      f(15, 'footer', 13),
      E(16, 'span', 14),
      f(17, 'button', 15),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.edit.emit(o.data));
      }),
      E(18, 'ng-icon', 16),
      M(19, ' Editar '),
      v(),
      f(20, 'button', 17),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.delete.emit(o.data));
      }),
      E(21, 'ng-icon', 18),
      M(22, ' Excluir '),
      v(),
      f(23, 'button', 19),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.download.emit());
      }),
      E(24, 'ng-icon', 20),
      M(25, ' Baixar '),
      v()()()(),
      It());
  }
  if (e & 2) {
    let n = k();
    (m(2),
      Tt('--accent', n.typeColor()),
      m(4),
      he(n.typeLabel()),
      m(5),
      he(n.data.name),
      m(),
      A('ngIf', n.data.teacher),
      m(),
      A('ngIf', n.chips().length),
      m(),
      A('ngIf', n.data.description));
  }
}
var uc = class e {
  constructor(t) {
    this.store = t;
  }
  open = !1;
  data;
  close = new T();
  download = new T();
  edit = new T();
  delete = new T();
  typeColor = ue(
    () => this.store.types().find((n) => n.id === this.data?.typeId)?.color ?? '#7c3aed',
  );
  typeLabel = ue(() => this.store.types().find((n) => n.id === this.data?.typeId)?.label ?? '');
  chips = ue(() =>
    this.data?.meetings?.length
      ? this.data.meetings.map((t) => ({ day: Ao[t.day] ?? t.day, ranges: r8(t.period, t.slots) }))
      : [],
  );
  static ɵfac = function (n) {
    return new (n || e)(I(We));
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-course-share']],
    inputs: { open: 'open', data: 'data' },
    outputs: { close: 'close', download: 'download', edit: 'edit', delete: 'delete' },
    decls: 1,
    vars: 1,
    consts: [
      [4, 'ngIf'],
      [1, 'share-backdrop'],
      [
        'id',
        'course-share',
        'role',
        'dialog',
        'aria-modal',
        'true',
        'aria-labelledby',
        'share-title',
        1,
        'share-card',
      ],
      [1, 'bg-accent'],
      [1, 'share-head'],
      [1, 'pill'],
      ['type', 'button', 'aria-label', 'Fechar', 1, 'icon-btn', 3, 'click'],
      ['name', 'lucideX', 1, 'icon-18'],
      [1, 'share-body'],
      ['id', 'share-title', 1, 'title'],
      ['class', 'meta', 4, 'ngIf'],
      ['class', 'sched', 4, 'ngIf'],
      ['class', 'desc', 4, 'ngIf'],
      [1, 'share-foot', 'no-print'],
      [1, 'spacer'],
      ['type', 'button', 1, 'btn-ghost', 3, 'click'],
      ['name', 'lucidePencil', 1, 'icon-16'],
      ['type', 'button', 1, 'btn-ghost', 'danger', 3, 'click'],
      ['name', 'lucideTrash2', 1, 'icon-16'],
      ['type', 'button', 1, 'btn', 3, 'click'],
      ['name', 'lucideDownload', 1, 'icon-16'],
      [1, 'meta'],
      ['name', 'lucideUser', 1, 'icon-18'],
      [1, 'sched'],
      ['class', 'chip-row', 4, 'ngFor', 'ngForOf'],
      [1, 'chip-row'],
      [1, 'chip', 'chip-day'],
      ['class', 'chip', 4, 'ngFor', 'ngForOf'],
      [1, 'chip'],
      ['name', 'lucideClock', 1, 'icon-16'],
      [1, 'desc'],
    ],
    template: function (n, r) {
      (n & 1 && Q(0, n8, 26, 7, 'ng-container', 0), n & 2 && A('ngIf', r.open && r.data));
    },
    dependencies: [ve, Wt, Ve, je],
    styles: [
      '[_nghost-%COMP%]{display:contents}.share-backdrop[_ngcontent-%COMP%]{position:fixed;inset:0;background:#00000073;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);display:grid;place-items:center;z-index:2147483647}.share-card[_ngcontent-%COMP%]{position:relative;width:min(760px,94vw);border-radius:24px;border:1px solid var(--border);background:color-mix(in oklab,var(--surface) 92%,transparent);box-shadow:var(--shadow-2);display:grid;z-index:1;grid-template-rows:auto 1fr auto;--accent: var(--accent, var(--primary));overflow:hidden}.bg-accent[_ngcontent-%COMP%]{position:absolute;inset:-20% -10% auto;height:260px;background:radial-gradient(120px 80px at 20% 60%,color-mix(in oklab,var(--accent, var(--primary)) 38%,transparent),transparent 60%),radial-gradient(160px 100px at 80% 30%,color-mix(in oklab,var(--accent, var(--primary)) 28%,transparent),transparent 60%);filter:blur(30px);opacity:.9;pointer-events:none}.share-head[_ngcontent-%COMP%]{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:linear-gradient(180deg,color-mix(in oklab,var(--surface) 96%,transparent),transparent)}.pill[_ngcontent-%COMP%]{background:color-mix(in oklab,var(--accent) 18%,transparent);border:1px solid color-mix(in oklab,var(--accent) 50%,var(--border));color:var(--txt);font-size:12px;padding:4px 10px;border-radius:999px}.icon-btn[_ngcontent-%COMP%]{display:grid;place-items:center;width:32px;height:32px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--muted);transition:transform .12s ease}.icon-btn[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.share-body[_ngcontent-%COMP%]{position:relative;z-index:1;padding:18px 18px 8px;display:grid;gap:12px}.title[_ngcontent-%COMP%]{margin:0;font-size:24px;font-weight:800;letter-spacing:.2px;color:var(--txt)}.meta[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:14px}.sched[_ngcontent-%COMP%]{display:grid;gap:8px}.chip-row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.chip[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:color-mix(in oklab,var(--accent) 16%,transparent);border:1px solid color-mix(in oklab,var(--accent) 45%,var(--border));font-size:12px}.chip-day[_ngcontent-%COMP%]{background:color-mix(in oklab,var(--accent) 22%,transparent);border-color:color-mix(in oklab,var(--accent) 60%,var(--border));font-weight:600}.desc[_ngcontent-%COMP%]{color:var(--txt);opacity:.92;line-height:1.5}.share-foot[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--border);background:linear-gradient(180deg,transparent,color-mix(in oklab,var(--surface-2) 92%,transparent))}.share-foot[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%]{flex:1}.btn-ghost.danger[_ngcontent-%COMP%]{color:#ef4444;border-color:#ef444459}.btn-ghost.danger[_ngcontent-%COMP%]:hover{background:#ef444414}@media print{.no-print[_ngcontent-%COMP%]{display:none!important}.share-backdrop[_ngcontent-%COMP%]{background:transparent}.share-card[_ngcontent-%COMP%]{box-shadow:none}}body.modal-open[_ngcontent-%COMP%]   .scroll-animated[_ngcontent-%COMP%], body.modal-open[_ngcontent-%COMP%]   .grid-wrap[_ngcontent-%COMP%]{transform:none!important;will-change:auto!important}#course-share.exporting[_ngcontent-%COMP%]   .share-head[_ngcontent-%COMP%]   .icon-btn[_ngcontent-%COMP%], #course-share.exporting[_ngcontent-%COMP%]   .share-foot[_ngcontent-%COMP%]{display:none!important}#course-share.exporting[_ngcontent-%COMP%]{border:none!important;box-shadow:none!important;overflow:hidden!important;background-clip:padding-box}',
    ],
  });
};
function r8(e, t) {
  if (!t?.length) return [];
  let n = Array.from(new Set(t)).sort((s, a) => s - a),
    r = [],
    o = n[0],
    i = n[0];
  for (let s = 1; s < n.length; s++) {
    let a = n[s];
    a === i + 1 ? (i = a) : (r.push([o, i]), (o = i = a));
  }
  return (
    r.push([o, i]),
    r.map(([s, a]) => {
      let [l] = rt(e, s),
        [, c] = rt(e, a);
      return `${Ot(l)}\u2013${Ot(c)}`;
    })
  );
}
function o8(e, t) {
  e & 1 && E(0, 'ng-icon', 15);
}
function i8(e, t) {
  if (e & 1) {
    let n = _e();
    (St(0),
      f(1, 'div', 1),
      S('click', function (o) {
        C(n);
        let i = k();
        return D(i.onBackdropClick(o));
      }),
      f(2, 'div', 2),
      E(3, 'div', 3),
      f(4, 'header', 4)(5, 'h3', 5),
      M(6),
      v(),
      f(7, 'button', 6),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.cancel.emit());
      }),
      E(8, 'ng-icon', 7),
      v()(),
      f(9, 'main', 8)(10, 'p', 9),
      M(11),
      v()(),
      f(12, 'footer', 10)(13, 'button', 11),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.cancel.emit());
      }),
      E(14, 'ng-icon', 12),
      M(15),
      v(),
      f(16, 'button', 13),
      S('click', function () {
        C(n);
        let o = k();
        return D(o.confirm.emit());
      }),
      Q(17, o8, 1, 0, 'ng-icon', 14),
      M(18),
      v()()()(),
      It());
  }
  if (e & 2) {
    let n = k();
    (m(2),
      Ne('aria-label', n.title),
      m(4),
      he(n.title),
      m(5),
      he(n.message),
      m(4),
      xe(' ', n.cancelLabel, ' '),
      m(),
      ie('danger', n.danger),
      m(),
      A('ngIf', n.danger),
      m(),
      xe(' ', n.confirmLabel, ' '));
  }
}
var pc = class e {
  open = !1;
  title = 'Confirma\xE7\xE3o';
  message = 'Tem certeza?';
  confirmLabel = 'Confirmar';
  cancelLabel = 'Cancelar';
  danger = !1;
  confirm = new T();
  cancel = new T();
  onBackdropClick(t) {
    t.target && t.target.classList.contains('confirm-backdrop') && this.cancel.emit();
  }
  onEsc() {
    this.open && this.cancel.emit();
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-confirm-dialog']],
    hostBindings: function (n, r) {
      n & 1 &&
        S(
          'keydown.escape',
          function () {
            return r.onEsc();
          },
          Fh,
        );
    },
    inputs: {
      open: 'open',
      title: 'title',
      message: 'message',
      confirmLabel: 'confirmLabel',
      cancelLabel: 'cancelLabel',
      danger: 'danger',
    },
    outputs: { confirm: 'confirm', cancel: 'cancel' },
    decls: 1,
    vars: 1,
    consts: [
      [4, 'ngIf'],
      [1, 'confirm-backdrop', 3, 'click'],
      ['role', 'dialog', 'aria-modal', 'true', 1, 'confirm-card'],
      [1, 'bg-accent'],
      [1, 'confirm-head'],
      [1, 'title'],
      ['type', 'button', 'aria-label', 'Fechar', 1, 'icon-btn', 3, 'click'],
      ['name', 'lucideX', 1, 'icon-18'],
      [1, 'confirm-body'],
      [1, 'message'],
      [1, 'confirm-foot'],
      ['type', 'button', 1, 'btn-ghost', 3, 'click'],
      ['name', 'lucideX', 1, 'icon-16'],
      ['type', 'button', 1, 'btn', 3, 'click'],
      ['name', 'lucideTrash2', 'class', 'icon-16', 4, 'ngIf'],
      ['name', 'lucideTrash2', 1, 'icon-16'],
    ],
    template: function (n, r) {
      (n & 1 && Q(0, i8, 19, 8, 'ng-container', 0), n & 2 && A('ngIf', r.open));
    },
    dependencies: [ve, Ve, je],
    styles: [
      '@charset "UTF-8";[_nghost-%COMP%]{display:contents}.confirm-backdrop[_ngcontent-%COMP%]{position:fixed;inset:0;background:#00000073;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);display:grid;place-items:center;z-index:2147483647}.confirm-card[_ngcontent-%COMP%]{position:relative;width:min(520px,92vw);border-radius:20px;border:1px solid var(--border);background:color-mix(in oklab,var(--surface) 94%,transparent);box-shadow:var(--shadow-2);display:grid;grid-template-rows:auto 1fr auto;overflow:hidden;z-index:1}.bg-accent[_ngcontent-%COMP%]{position:absolute;inset:-20% -10% auto;height:200px;background:radial-gradient(110px 70px at 20% 60%,color-mix(in oklab,var(--primary) 28%,transparent),transparent 60%),radial-gradient(140px 90px at 80% 30%,color-mix(in oklab,var(--primary) 18%,transparent),transparent 60%);filter:blur(28px);opacity:.9;pointer-events:none}.confirm-head[_ngcontent-%COMP%]{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:linear-gradient(180deg,color-mix(in oklab,var(--surface) 96%,transparent),transparent);border-bottom:1px solid var(--border)}.title[_ngcontent-%COMP%]{margin:0;font-size:18px;font-weight:800;color:var(--txt)}.icon-btn[_ngcontent-%COMP%]{display:grid;place-items:center;width:32px;height:32px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--muted);transition:transform .12s ease}.icon-btn[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.confirm-body[_ngcontent-%COMP%]{padding:16px;color:var(--txt)}.message[_ngcontent-%COMP%]{margin:0;line-height:1.5;opacity:.92}.confirm-foot[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--border);background:linear-gradient(180deg,transparent,color-mix(in oklab,var(--surface-2) 92%,transparent))}.btn.danger[_ngcontent-%COMP%]{--btn-bg: color-mix(in oklab, #ef4444 22%, transparent);border-color:color-mix(in oklab,#ef4444 55%,var(--border));color:#ef4444;background-color:transparent}.btn.danger[_ngcontent-%COMP%]:hover{background:color-mix(in oklab,#ef4444 12%,transparent)}',
    ],
  });
};
function bw(e, t) {
  if (e.match(/^[a-z]+:\/\//i)) return e;
  if (e.match(/^\/\//)) return window.location.protocol + e;
  if (e.match(/^[a-z]+:/i)) return e;
  let n = document.implementation.createHTMLDocument(),
    r = n.createElement('base'),
    o = n.createElement('a');
  return (n.head.appendChild(r), n.body.appendChild(o), t && (r.href = t), (o.href = e), o.href);
}
var Ew = (() => {
  let e = 0,
    t = () => `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
  return () => ((e += 1), `u${t()}${e}`);
})();
function Nt(e) {
  let t = [];
  for (let n = 0, r = e.length; n < r; n++) t.push(e[n]);
  return t;
}
var jo = null;
function fc(e = {}) {
  return (
    jo ||
    (e.includeStyleProperties
      ? ((jo = e.includeStyleProperties), jo)
      : ((jo = Nt(window.getComputedStyle(document.documentElement))), jo))
  );
}
function gc(e, t) {
  let r = (e.ownerDocument.defaultView || window).getComputedStyle(e).getPropertyValue(t);
  return r ? parseFloat(r.replace('px', '')) : 0;
}
function s8(e) {
  let t = gc(e, 'border-left-width'),
    n = gc(e, 'border-right-width');
  return e.clientWidth + t + n;
}
function a8(e) {
  let t = gc(e, 'border-top-width'),
    n = gc(e, 'border-bottom-width');
  return e.clientHeight + t + n;
}
function Gp(e, t = {}) {
  let n = t.width || s8(e),
    r = t.height || a8(e);
  return { width: n, height: r };
}
function Sw() {
  let e, t;
  try {
    t = process;
  } catch {}
  let n = t && t.env ? t.env.devicePixelRatio : null;
  return (
    n && ((e = parseInt(n, 10)), Number.isNaN(e) && (e = 1)),
    e || window.devicePixelRatio || 1
  );
}
var ot = 16384;
function Iw(e) {
  (e.width > ot || e.height > ot) &&
    (e.width > ot && e.height > ot
      ? e.width > e.height
        ? ((e.height *= ot / e.width), (e.width = ot))
        : ((e.width *= ot / e.height), (e.height = ot))
      : e.width > ot
        ? ((e.height *= ot / e.width), (e.width = ot))
        : ((e.width *= ot / e.height), (e.height = ot)));
}
function Bo(e) {
  return new Promise((t, n) => {
    let r = new Image();
    ((r.onload = () => {
      r.decode().then(() => {
        requestAnimationFrame(() => t(r));
      });
    }),
      (r.onerror = n),
      (r.crossOrigin = 'anonymous'),
      (r.decoding = 'async'),
      (r.src = e));
  });
}
async function l8(e) {
  return Promise.resolve()
    .then(() => new XMLSerializer().serializeToString(e))
    .then(encodeURIComponent)
    .then((t) => `data:image/svg+xml;charset=utf-8,${t}`);
}
async function Tw(e, t, n) {
  let r = 'http://www.w3.org/2000/svg',
    o = document.createElementNS(r, 'svg'),
    i = document.createElementNS(r, 'foreignObject');
  return (
    o.setAttribute('width', `${t}`),
    o.setAttribute('height', `${n}`),
    o.setAttribute('viewBox', `0 0 ${t} ${n}`),
    i.setAttribute('width', '100%'),
    i.setAttribute('height', '100%'),
    i.setAttribute('x', '0'),
    i.setAttribute('y', '0'),
    i.setAttribute('externalResourcesRequired', 'true'),
    o.appendChild(i),
    i.appendChild(e),
    l8(o)
  );
}
var Be = (e, t) => {
  if (e instanceof t) return !0;
  let n = Object.getPrototypeOf(e);
  return n === null ? !1 : n.constructor.name === t.name || Be(n, t);
};
function c8(e) {
  let t = e.getPropertyValue('content');
  return `${e.cssText} content: '${t.replace(/'|"/g, '')}';`;
}
function d8(e, t) {
  return fc(t)
    .map((n) => {
      let r = e.getPropertyValue(n),
        o = e.getPropertyPriority(n);
      return `${n}: ${r}${o ? ' !important' : ''};`;
    })
    .join(' ');
}
function h8(e, t, n, r) {
  let o = `.${e}:${t}`,
    i = n.cssText ? c8(n) : d8(n, r);
  return document.createTextNode(`${o}{${i}}`);
}
function Aw(e, t, n, r) {
  let o = window.getComputedStyle(e, n),
    i = o.getPropertyValue('content');
  if (i === '' || i === 'none') return;
  let s = Ew();
  try {
    t.className = `${t.className} ${s}`;
  } catch {
    return;
  }
  let a = document.createElement('style');
  (a.appendChild(h8(s, n, o, r)), t.appendChild(a));
}
function Rw(e, t, n) {
  (Aw(e, t, ':before', n), Aw(e, t, ':after', n));
}
var Pw = 'application/font-woff',
  Ow = 'image/jpeg',
  u8 = {
    woff: Pw,
    woff2: Pw,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: Ow,
    jpeg: Ow,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    webp: 'image/webp',
  };
function p8(e) {
  let t = /\.([^./]*?)$/g.exec(e);
  return t ? t[1] : '';
}
function Lo(e) {
  let t = p8(e).toLowerCase();
  return u8[t] || '';
}
function g8(e) {
  return e.split(/,/)[1];
}
function vs(e) {
  return e.search(/^(data:)/) !== -1;
}
function Wp(e, t) {
  return `data:${t};base64,${e}`;
}
async function Zp(e, t, n) {
  let r = await fetch(e, t);
  if (r.status === 404) throw new Error(`Resource "${r.url}" not found`);
  let o = await r.blob();
  return new Promise((i, s) => {
    let a = new FileReader();
    ((a.onerror = s),
      (a.onloadend = () => {
        try {
          i(n({ res: r, result: a.result }));
        } catch (l) {
          s(l);
        }
      }),
      a.readAsDataURL(o));
  });
}
var qp = {};
function f8(e, t, n) {
  let r = e.replace(/\?.*/, '');
  return (
    n && (r = e),
    /ttf|otf|eot|woff2?/i.test(r) && (r = r.replace(/.*\//, '')),
    t ? `[${t}]${r}` : r
  );
}
async function Fo(e, t, n) {
  let r = f8(e, t, n.includeQueryParams);
  if (qp[r] != null) return qp[r];
  n.cacheBust && (e += (/\?/.test(e) ? '&' : '?') + new Date().getTime());
  let o;
  try {
    let i = await Zp(
      e,
      n.fetchRequestInit,
      ({ res: s, result: a }) => (t || (t = s.headers.get('Content-Type') || ''), g8(a)),
    );
    o = Wp(i, t);
  } catch (i) {
    o = n.imagePlaceholder || '';
    let s = `Failed to fetch resource: ${e}`;
    (i && (s = typeof i == 'string' ? i : i.message), s && console.warn(s));
  }
  return ((qp[r] = o), o);
}
async function v8(e) {
  let t = e.toDataURL();
  return t === 'data:,' ? e.cloneNode(!1) : Bo(t);
}
async function w8(e, t) {
  if (e.currentSrc) {
    let i = document.createElement('canvas'),
      s = i.getContext('2d');
    ((i.width = e.clientWidth),
      (i.height = e.clientHeight),
      s?.drawImage(e, 0, 0, i.width, i.height));
    let a = i.toDataURL();
    return Bo(a);
  }
  let n = e.poster,
    r = Lo(n),
    o = await Fo(n, r, t);
  return Bo(o);
}
async function m8(e, t) {
  var n;
  try {
    if (!((n = e?.contentDocument) === null || n === void 0) && n.body)
      return await ws(e.contentDocument.body, t, !0);
  } catch {}
  return e.cloneNode(!1);
}
async function k8(e, t) {
  return Be(e, HTMLCanvasElement)
    ? v8(e)
    : Be(e, HTMLVideoElement)
      ? w8(e, t)
      : Be(e, HTMLIFrameElement)
        ? m8(e, t)
        : e.cloneNode(Nw(e));
}
var y8 = (e) => e.tagName != null && e.tagName.toUpperCase() === 'SLOT',
  Nw = (e) => e.tagName != null && e.tagName.toUpperCase() === 'SVG';
async function _8(e, t, n) {
  var r, o;
  if (Nw(t)) return t;
  let i = [];
  return (
    y8(e) && e.assignedNodes
      ? (i = Nt(e.assignedNodes()))
      : Be(e, HTMLIFrameElement) && !((r = e.contentDocument) === null || r === void 0) && r.body
        ? (i = Nt(e.contentDocument.body.childNodes))
        : (i = Nt(((o = e.shadowRoot) !== null && o !== void 0 ? o : e).childNodes)),
    i.length === 0 ||
      Be(e, HTMLVideoElement) ||
      (await i.reduce(
        (s, a) =>
          s
            .then(() => ws(a, n))
            .then((l) => {
              l && t.appendChild(l);
            }),
        Promise.resolve(),
      )),
    t
  );
}
function x8(e, t, n) {
  let r = t.style;
  if (!r) return;
  let o = window.getComputedStyle(e);
  o.cssText
    ? ((r.cssText = o.cssText), (r.transformOrigin = o.transformOrigin))
    : fc(n).forEach((i) => {
        let s = o.getPropertyValue(i);
        (i === 'font-size' &&
          s.endsWith('px') &&
          (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`),
          Be(e, HTMLIFrameElement) && i === 'display' && s === 'inline' && (s = 'block'),
          i === 'd' && t.getAttribute('d') && (s = `path(${t.getAttribute('d')})`),
          r.setProperty(i, s, o.getPropertyPriority(i)));
      });
}
function M8(e, t) {
  (Be(e, HTMLTextAreaElement) && (t.innerHTML = e.value),
    Be(e, HTMLInputElement) && t.setAttribute('value', e.value));
}
function C8(e, t) {
  if (Be(e, HTMLSelectElement)) {
    let n = t,
      r = Array.from(n.children).find((o) => e.value === o.getAttribute('value'));
    r && r.setAttribute('selected', '');
  }
}
function D8(e, t, n) {
  return (Be(t, Element) && (x8(e, t, n), Rw(e, t, n), M8(e, t), C8(e, t)), t);
}
async function b8(e, t) {
  let n = e.querySelectorAll ? e.querySelectorAll('use') : [];
  if (n.length === 0) return e;
  let r = {};
  for (let i = 0; i < n.length; i++) {
    let a = n[i].getAttribute('xlink:href');
    if (a) {
      let l = e.querySelector(a),
        c = document.querySelector(a);
      !l && c && !r[a] && (r[a] = await ws(c, t, !0));
    }
  }
  let o = Object.values(r);
  if (o.length) {
    let i = 'http://www.w3.org/1999/xhtml',
      s = document.createElementNS(i, 'svg');
    (s.setAttribute('xmlns', i),
      (s.style.position = 'absolute'),
      (s.style.width = '0'),
      (s.style.height = '0'),
      (s.style.overflow = 'hidden'),
      (s.style.display = 'none'));
    let a = document.createElementNS(i, 'defs');
    s.appendChild(a);
    for (let l = 0; l < o.length; l++) a.appendChild(o[l]);
    e.appendChild(s);
  }
  return e;
}
async function ws(e, t, n) {
  return !n && t.filter && !t.filter(e)
    ? null
    : Promise.resolve(e)
        .then((r) => k8(r, t))
        .then((r) => _8(e, r, t))
        .then((r) => D8(e, r, t))
        .then((r) => b8(r, t));
}
var jw = /url\((['"]?)([^'"]+?)\1\)/g,
  E8 = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,
  S8 = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function I8(e) {
  let t = e.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
  return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`, 'g');
}
function T8(e) {
  let t = [];
  return (e.replace(jw, (n, r, o) => (t.push(o), n)), t.filter((n) => !vs(n)));
}
async function A8(e, t, n, r, o) {
  try {
    let i = n ? bw(t, n) : t,
      s = Lo(t),
      a;
    if (o) {
      let l = await o(i);
      a = Wp(l, s);
    } else a = await Fo(i, s, r);
    return e.replace(I8(t), `$1${a}$3`);
  } catch {}
  return e;
}
function R8(e, { preferredFontFormat: t }) {
  return t
    ? e.replace(S8, (n) => {
        for (;;) {
          let [r, , o] = E8.exec(n) || [];
          if (!o) return '';
          if (o === t) return `src: ${r};`;
        }
      })
    : e;
}
function Yp(e) {
  return e.search(jw) !== -1;
}
async function vc(e, t, n) {
  if (!Yp(e)) return e;
  let r = R8(e, n);
  return T8(r).reduce((i, s) => i.then((a) => A8(a, s, t, n)), Promise.resolve(r));
}
async function Vo(e, t, n) {
  var r;
  let o = (r = t.style) === null || r === void 0 ? void 0 : r.getPropertyValue(e);
  if (o) {
    let i = await vc(o, null, n);
    return (t.style.setProperty(e, i, t.style.getPropertyPriority(e)), !0);
  }
  return !1;
}
async function P8(e, t) {
  ((await Vo('background', e, t)) || (await Vo('background-image', e, t)),
    (await Vo('mask', e, t)) ||
      (await Vo('-webkit-mask', e, t)) ||
      (await Vo('mask-image', e, t)) ||
      (await Vo('-webkit-mask-image', e, t)));
}
async function O8(e, t) {
  let n = Be(e, HTMLImageElement);
  if (!(n && !vs(e.src)) && !(Be(e, SVGImageElement) && !vs(e.href.baseVal))) return;
  let r = n ? e.src : e.href.baseVal,
    o = await Fo(r, Lo(r), t);
  await new Promise((i, s) => {
    ((e.onload = i),
      (e.onerror = t.onImageErrorHandler
        ? (...l) => {
            try {
              i(t.onImageErrorHandler(...l));
            } catch (c) {
              s(c);
            }
          }
        : s));
    let a = e;
    (a.decode && (a.decode = i),
      a.loading === 'lazy' && (a.loading = 'eager'),
      n ? ((e.srcset = ''), (e.src = o)) : (e.href.baseVal = o));
  });
}
async function N8(e, t) {
  let r = Nt(e.childNodes).map((o) => Kp(o, t));
  await Promise.all(r).then(() => e);
}
async function Kp(e, t) {
  Be(e, Element) && (await P8(e, t), await O8(e, t), await N8(e, t));
}
function Bw(e, t) {
  let { style: n } = e;
  (t.backgroundColor && (n.backgroundColor = t.backgroundColor),
    t.width && (n.width = `${t.width}px`),
    t.height && (n.height = `${t.height}px`));
  let r = t.style;
  return (
    r != null &&
      Object.keys(r).forEach((o) => {
        n[o] = r[o];
      }),
    e
  );
}
var Lw = {};
async function Fw(e) {
  let t = Lw[e];
  if (t != null) return t;
  let r = await (await fetch(e)).text();
  return ((t = { url: e, cssText: r }), (Lw[e] = t), t);
}
async function Vw(e, t) {
  let n = e.cssText,
    r = /url\(["']?([^"')]+)["']?\)/g,
    i = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
      let a = s.replace(r, '$1');
      return (
        a.startsWith('https://') || (a = new URL(a, e.url).href),
        Zp(a, t.fetchRequestInit, ({ result: l }) => ((n = n.replace(s, `url(${l})`)), [s, l]))
      );
    });
  return Promise.all(i).then(() => n);
}
function Hw(e) {
  if (e == null) return [];
  let t = [],
    n = /(\/\*[\s\S]*?\*\/)/gi,
    r = e.replace(n, ''),
    o = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
  for (;;) {
    let l = o.exec(r);
    if (l === null) break;
    t.push(l[0]);
  }
  r = r.replace(o, '');
  let i = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,
    s =
      '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})',
    a = new RegExp(s, 'gi');
  for (;;) {
    let l = i.exec(r);
    if (l === null) {
      if (((l = a.exec(r)), l === null)) break;
      i.lastIndex = a.lastIndex;
    } else a.lastIndex = i.lastIndex;
    t.push(l[0]);
  }
  return t;
}
async function j8(e, t) {
  let n = [],
    r = [];
  return (
    e.forEach((o) => {
      if ('cssRules' in o)
        try {
          Nt(o.cssRules || []).forEach((i, s) => {
            if (i.type === CSSRule.IMPORT_RULE) {
              let a = s + 1,
                l = i.href,
                c = Fw(l)
                  .then((d) => Vw(d, t))
                  .then((d) =>
                    Hw(d).forEach((h) => {
                      try {
                        o.insertRule(h, h.startsWith('@import') ? (a += 1) : o.cssRules.length);
                      } catch (g) {
                        console.error('Error inserting rule from remote css', {
                          rule: h,
                          error: g,
                        });
                      }
                    }),
                  )
                  .catch((d) => {
                    console.error('Error loading remote css', d.toString());
                  });
              r.push(c);
            }
          });
        } catch (i) {
          let s = e.find((a) => a.href == null) || document.styleSheets[0];
          (o.href != null &&
            r.push(
              Fw(o.href)
                .then((a) => Vw(a, t))
                .then((a) =>
                  Hw(a).forEach((l) => {
                    s.insertRule(l, s.cssRules.length);
                  }),
                )
                .catch((a) => {
                  console.error('Error loading remote stylesheet', a);
                }),
            ),
            console.error('Error inlining remote css file', i));
        }
    }),
    Promise.all(r).then(
      () => (
        e.forEach((o) => {
          if ('cssRules' in o)
            try {
              Nt(o.cssRules || []).forEach((i) => {
                n.push(i);
              });
            } catch (i) {
              console.error(`Error while reading CSS rules from ${o.href}`, i);
            }
        }),
        n
      ),
    )
  );
}
function B8(e) {
  return e
    .filter((t) => t.type === CSSRule.FONT_FACE_RULE)
    .filter((t) => Yp(t.style.getPropertyValue('src')));
}
async function L8(e, t) {
  if (e.ownerDocument == null) throw new Error('Provided element is not within a Document');
  let n = Nt(e.ownerDocument.styleSheets),
    r = await j8(n, t);
  return B8(r);
}
function Uw(e) {
  return e.trim().replace(/["']/g, '');
}
function F8(e) {
  let t = new Set();
  function n(r) {
    ((r.style.fontFamily || getComputedStyle(r).fontFamily).split(',').forEach((i) => {
      t.add(Uw(i));
    }),
      Array.from(r.children).forEach((i) => {
        i instanceof HTMLElement && n(i);
      }));
  }
  return (n(e), t);
}
async function zw(e, t) {
  let n = await L8(e, t),
    r = F8(e);
  return (
    await Promise.all(
      n
        .filter((i) => r.has(Uw(i.style.fontFamily)))
        .map((i) => {
          let s = i.parentStyleSheet ? i.parentStyleSheet.href : null;
          return vc(i.cssText, s, t);
        }),
    )
  ).join(`
`);
}
async function $w(e, t) {
  let n = t.fontEmbedCSS != null ? t.fontEmbedCSS : t.skipFonts ? null : await zw(e, t);
  if (n) {
    let r = document.createElement('style'),
      o = document.createTextNode(n);
    (r.appendChild(o), e.firstChild ? e.insertBefore(r, e.firstChild) : e.appendChild(r));
  }
}
async function V8(e, t = {}) {
  let { width: n, height: r } = Gp(e, t),
    o = await ws(e, t, !0);
  return (await $w(o, t), await Kp(o, t), Bw(o, t), await Tw(o, n, r));
}
async function H8(e, t = {}) {
  let { width: n, height: r } = Gp(e, t),
    o = await V8(e, t),
    i = await Bo(o),
    s = document.createElement('canvas'),
    a = s.getContext('2d'),
    l = t.pixelRatio || Sw(),
    c = t.canvasWidth || n,
    d = t.canvasHeight || r;
  return (
    (s.width = c * l),
    (s.height = d * l),
    t.skipAutoScale || Iw(s),
    (s.style.width = `${c}`),
    (s.style.height = `${d}`),
    t.backgroundColor && ((a.fillStyle = t.backgroundColor), a.fillRect(0, 0, s.width, s.height)),
    a.drawImage(i, 0, 0, s.width, s.height),
    s
  );
}
async function Gw(e, t = {}) {
  return (await H8(e, t)).toDataURL();
}
var wc = class e {
  async exportElAsPng(t, n) {
    let r = await Gw(t, { cacheBust: !0, pixelRatio: 2 }),
      o = document.createElement('a');
    ((o.href = r), (o.download = n), o.click());
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
};
var Ho = class e {
  openAddModal = W(!1);
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
};
function $8(e, t) {
  if (e & 1) {
    let n = _e();
    (f(0, 'app-course-share', 7),
      S('close', function () {
        C(n);
        let o = k();
        return D(o.closeShare());
      })('download', function () {
        C(n);
        let o = k();
        return D(o.downloadShare());
      })('edit', function (o) {
        C(n);
        let i = k();
        return D(i.onEditCourse(o));
      })('delete', function (o) {
        C(n);
        let i = k();
        return D(i.onDeleteCourse(o));
      }),
      v());
  }
  if (e & 2) {
    let n = k();
    A('open', n.shareOpen())('data', n.shareData() ?? n.shareCourse());
  }
}
var mc = class e {
  constructor(t, n, r, o, i) {
    this.exportImg = t;
    this.toast = n;
    this.store = r;
    this.ui = o;
    this.injector = i;
    On(
      () => {
        this.ui.openAddModal() &&
          (this.startNewDraft(),
          this.modal.set(!0),
          document.body.classList.add('modal-open'),
          this.ui.openAddModal.set(!1));
      },
      { injector: this.injector },
    );
  }
  grid;
  exportGrid = async () => {
    let t = document.getElementById('grid'),
      n = t?.querySelector('.grid');
    if (!t || !n) return;
    (await this.grid?.enableExportMode(), t.classList.add('exporting'));
    let r = { wrapOverflow: t.style.overflow, contentWidth: n.style.width, bg: n.style.background };
    try {
      await new Promise((s) => requestAnimationFrame(s));
      let o = n.scrollWidth;
      ((t.style.overflow = 'visible'), (n.style.width = `${o}px`));
      let i = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#0f1115';
      ((n.style.background = i.trim()),
        await this.exportImg.exportElAsPng(n, 'horarios.png'),
        this.toast.success('Imagem de hor\xE1rios exportada.'));
    } catch (o) {
      (this.toast.push('Falha ao exportar imagem.', 'warn'), console.error(o));
    } finally {
      ((n.style.width = r.contentWidth),
        (n.style.background = r.bg),
        (t.style.overflow = r.wrapOverflow),
        t.classList.remove('exporting'),
        this.grid?.disableExportMode());
    }
  };
  modal = W(!1);
  shareOpen = W(!1);
  shareData = W(null);
  shareCourse = W(null);
  editing = W(null);
  confirmOpen = W(!1);
  confirmData = W(null);
  ngOnInit() {
    this.store.hydrate();
  }
  startNewDraft() {
    let t = this.store.types()[0]?.id ?? 'obg';
    this.editing.set({ name: '', teacher: '', description: '', typeId: t, meetings: [] });
  }
  openModal() {
    (this.modal.set(!0), document.body.classList.add('modal-open'));
  }
  closeModal() {
    (this.modal.set(!1), document.body.classList.remove('modal-open'));
  }
  confirmDelete = () => {
    let t = this.confirmData();
    t &&
      (this.store.removeCourse
        ? (this.store.removeCourse(t.id), this.toast.success('Disciplina exclu\xEDda.'))
        : (console.warn('Implemente ScheduleStore.removeCourse(id: string)'),
          this.toast.push('N\xE3o foi poss\xEDvel excluir. M\xE9todo ausente no Store.', 'warn')),
      this.shareOpen.set(!1),
      this.shareCourse.set(null),
      this.shareData.set(null),
      this.confirmOpen.set(!1),
      this.confirmData.set(null));
  };
  cancelDelete = () => {
    (this.confirmOpen.set(!1),
      this.confirmData.set(null),
      this.toast.push('Exclus\xE3o cancelada.', 'info'));
  };
  onAddAt = (t) => {
    (this.editing.set({
      name: '',
      teacher: '',
      description: '',
      typeId: 'obg',
      meetings: [{ day: t.day, period: t.period, slots: [t.slot] }],
    }),
      this.modal.set(!0),
      this.toast?.push('Preencha os dados da nova disciplina.', 'info'));
  };
  onEditCourse = (t) => {
    this.shareOpen.set(!1);
    let r = ('id' in t && t.id ? this.store.courses().find((i) => i.id === t.id) : null) ?? t,
      o = r.meetings.map((i) => ({
        day: i.day,
        period: i.period,
        slots: [...i.slots].sort((s, a) => s - a),
      }));
    (this.editing.set({
      id: r.id,
      name: r.name,
      teacher: r.teacher,
      description: r.description,
      typeId: r.typeId,
      meetings: o,
    }),
      this.modal.set(!0),
      this.toast.push(`Editando "${r.name}".`, 'info'));
  };
  onDeleteCourse = (t) => {
    if (!('id' in t) || !t.id) {
      (this.shareOpen.set(!1),
        this.shareCourse.set(null),
        this.shareData.set(null),
        this.toast.push('Rascunho descartado.', 'success'));
      return;
    }
    (this.confirmData.set({ id: t.id, name: t.name || 'Disciplina' }), this.confirmOpen.set(!0));
  };
  openShare = (t) => {
    (this.shareData.set(null),
      this.shareCourse.set(t),
      this.shareOpen.set(!0),
      document.body.classList.add('modal-open'));
  };
  closeShare = () => {
    (this.shareOpen.set(!1),
      this.shareCourse.set(null),
      document.body.classList.remove('modal-open'));
  };
  openShareDraft = (t) => {
    (this.shareCourse.set(null), this.shareData.set(t), this.shareOpen.set(!0));
  };
  downloadShare = async () => {
    let t = document.getElementById('course-share');
    if (t) {
      t.classList.add('exporting');
      try {
        (await this.exportImg.exportElAsPng(t, 'cadeira.png'),
          this.toast.push('Imagem da cadeira exportada.', 'success'));
      } catch (n) {
        (this.toast.push('Falha ao exportar imagem.', 'warn'), console.error(n));
      } finally {
        t.classList.remove('exporting');
      }
    }
  };
  exportShare() {
    let t = document.getElementById('course-share');
    t &&
      (this.exportImg.exportElAsPng(t, 'disciplina.png'),
      this.toast.success('Imagem da disciplina exportada.'));
  }
  static ɵfac = function (n) {
    return new (n || e)(I(wc), I(Hn), I(We), I(Ho), I(pe));
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-home']],
    viewQuery: function (n, r) {
      if ((n & 1 && wr(cs, 5), n & 2)) {
        let o;
        mr((o = kr())) && (r.grid = o.first);
      }
    },
    decls: 8,
    vars: 7,
    consts: [
      [1, 'container', 'actions'],
      [1, 'btn', 'btn-ghost', 3, 'click'],
      ['name', 'lucideDownload', 1, 'icon-18'],
      [3, 'openShare', 'addAt'],
      [3, 'open', 'data', 'close', 'download', 'edit', 'delete', 4, 'ngIf'],
      [3, 'close', 'download', 'open', 'initial'],
      [
        'confirmLabel',
        'Excluir',
        'cancelLabel',
        'Cancelar',
        3,
        'confirm',
        'cancel',
        'open',
        'title',
        'message',
        'danger',
      ],
      [3, 'close', 'download', 'edit', 'delete', 'open', 'data'],
    ],
    template: function (n, r) {
      if (
        (n & 1 &&
          (f(0, 'section', 0)(1, 'button', 1),
          S('click', function () {
            return r.exportGrid();
          }),
          E(2, 'ng-icon', 2),
          M(3, ' Baixar hor\xE1rios '),
          v()(),
          f(4, 'app-schedule-grid', 3),
          S('openShare', function (i) {
            return r.openShare(i);
          })('addAt', function (i) {
            return r.onAddAt(i);
          }),
          v(),
          Q(5, $8, 1, 2, 'app-course-share', 4),
          f(6, 'app-course-modal', 5),
          S('close', function () {
            return r.closeModal();
          })('download', function (i) {
            return r.openShareDraft(i);
          }),
          v(),
          f(7, 'app-confirm-dialog', 6),
          S('confirm', function () {
            return r.confirmDelete();
          })('cancel', function () {
            return r.cancelDelete();
          }),
          v()),
        n & 2)
      ) {
        let o;
        (m(5),
          A('ngIf', r.shareOpen()),
          m(),
          A('open', r.modal())('initial', r.editing()),
          m(),
          A('open', r.confirmOpen())('title', 'Excluir disciplina?')(
            'message',
            'Tem certeza que deseja excluir ' +
              (((o = r.confirmData()) == null ? null : o.name) || 'a disciplina') +
              '? Esta a\xE7\xE3o n\xE3o pode ser desfeita.',
          )('danger', !0));
      }
    },
    dependencies: [ve, Ve, je, cs, hc, uc, pc],
    styles: [
      '@charset "UTF-8";.actions[_ngcontent-%COMP%]{position:sticky;top:64px;z-index:20;display:flex;flex-wrap:wrap;gap:10px;padding:10px 12px;margin-bottom:8px;background:linear-gradient(180deg,color-mix(in oklab,var(--bg) 88%,transparent),color-mix(in oklab,var(--bg) 60%,transparent));-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:14px}#add[_ngcontent-%COMP%]{scroll-margin-top:88px}',
    ],
  });
};
var kc = class e {
  constructor(t) {
    this.store = t;
  }
  resolve() {
    return this.store.hydrate();
  }
  static ɵfac = function (n) {
    return new (n || e)(O(We));
  };
  static ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' });
};
var Ww = [
  { path: '', component: mc, resolve: { schedule: kc } },
  { path: '**', redirectTo: '' },
];
var Zw =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M5 3h14"></path><path d="m18 13-6-6-6 6"></path><path d="M12 7v14"></path></svg>';
var Yw =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>';
var Kw =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="m6 9 6 6 6-6"></path></svg>';
var Qw =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="m18 15-6-6-6 6"></path></svg>';
var Xw =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>';
var Jw =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>';
var em =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
var tm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>';
var nm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"></path><path d="m5.082 11.09 8.828 8.828"></path></svg>';
var rm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>';
var om =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>';
var im =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
var sm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M12 2v20"></path><path d="m15 19-3 3-3-3"></path><path d="m19 9 3 3-3 3"></path><path d="M2 12h20"></path><path d="m5 9-3 3 3 3"></path><path d="m9 5 3-3 3 3"></path></svg>';
var am =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>';
var lm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>';
var cm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>';
var dm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
var hm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M12 10V2"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m16 6-4 4-4-4"></path><path d="M16 18a4 4 0 0 0-8 0"></path></svg>';
var um =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>';
var pm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>';
var gm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
var fm =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--ng-icon__stroke-width, 2)"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
var vm = {
  providers: [
    mu(),
    dp(Ww),
    hv({
      lucideEraser: nm,
      lucideSave: cm,
      lucidePlus: lm,
      lucidePencil: am,
      lucideTrash2: um,
      lucideDownload: tm,
      lucideMove: sm,
      lucideCalendar: Yw,
      lucideClock: em,
      lucideX: fm,
      lucideInfo: om,
      lucideUser: gm,
      lucideChevronDown: Kw,
      lucideCircleX: Jw,
      lucideTriangleAlert: pm,
      lucideCircleCheck: Xw,
      lucideSun: dm,
      lucideMoon: im,
      lucideSunset: hm,
      lucideGithub: rm,
      lucideArrowUpToLine: Zw,
      lucideChevronUp: Qw,
    }),
  ],
};
function G8(e, t) {
  e & 1 && E(0, 'ng-icon', 12);
}
function q8(e, t) {
  e & 1 && E(0, 'ng-icon', 13);
}
function W8(e, t) {
  e & 1 && E(0, 'ng-icon', 14);
}
function Z8(e, t) {
  e & 1 && E(0, 'ng-icon', 15);
}
function Y8(e, t) {
  if (e & 1) {
    let n = _e();
    (f(0, 'div', 2),
      an(function () {
        return (C(n), D('toast-leave'));
      }),
      sn(function () {
        return (C(n), D('toast-enter'));
      }),
      f(1, 'div', 3),
      Q(2, G8, 1, 0, 'ng-icon', 4)(3, q8, 1, 0, 'ng-icon', 5)(4, W8, 1, 0, 'ng-icon', 6)(
        5,
        Z8,
        1,
        0,
        'ng-icon',
        7,
      ),
      v(),
      f(6, 'span', 8),
      M(7),
      v(),
      f(8, 'button', 9),
      S('click', function () {
        let o = C(n).$implicit,
          i = k();
        return D(i.toast.dismiss(o.id));
      }),
      E(9, 'ng-icon', 10),
      v(),
      E(10, 'div', 11),
      v());
  }
  if (e & 2) {
    let n = t.$implicit;
    (Tt('--ttl', (n.ttl ?? 4e3) + 'ms'),
      A('ngClass', n.tone),
      Ne('role', n.tone === 'error' || n.tone === 'warn' ? 'alert' : 'status'),
      m(2),
      A('ngIf', n.tone === 'info'),
      m(),
      A('ngIf', n.tone === 'success'),
      m(),
      A('ngIf', n.tone === 'warn'),
      m(),
      A('ngIf', n.tone === 'error'),
      m(2),
      he(n.message));
  }
}
var yc = class e {
  constructor(t) {
    this.toast = t;
  }
  trackToast = (t, n) => n.id;
  static ɵfac = function (n) {
    return new (n || e)(I(Hn));
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-toast-container']],
    features: [bi()],
    decls: 2,
    vars: 2,
    consts: [
      ['aria-live', 'polite', 'aria-atomic', 'true', 1, 'toasts'],
      ['class', 'toast', 3, 'ngClass', '--ttl', 4, 'ngFor', 'ngForOf', 'ngForTrackBy'],
      [1, 'toast', 3, 'ngClass'],
      [1, 'ico'],
      ['name', 'lucideInfo', 'class', 'icon-18', 4, 'ngIf'],
      ['name', 'lucideCheckCircle2', 'class', 'icon-18', 4, 'ngIf'],
      ['name', 'lucideAlertTriangle', 'class', 'icon-18', 4, 'ngIf'],
      ['name', 'lucideXCircle', 'class', 'icon-18', 4, 'ngIf'],
      [1, 'msg'],
      ['type', 'button', 'aria-label', 'Fechar', 1, 'close', 3, 'click'],
      ['name', 'lucideX', 1, 'icon-16'],
      [1, 'bar'],
      ['name', 'lucideInfo', 1, 'icon-18'],
      ['name', 'lucideCheckCircle2', 1, 'icon-18'],
      ['name', 'lucideAlertTriangle', 1, 'icon-18'],
      ['name', 'lucideXCircle', 1, 'icon-18'],
    ],
    template: function (n, r) {
      (n & 1 && (f(0, 'div', 0), Q(1, Y8, 11, 9, 'div', 1), v()),
        n & 2 && (m(), A('ngForOf', r.toast.list())('ngForTrackBy', r.trackToast)));
    },
    dependencies: [ve, Iu, Wt, Ve, je],
    styles: [
      '@charset "UTF-8";.toasts[_ngcontent-%COMP%]{position:fixed;bottom:18px;left:50%;transform:translate(-50%);display:grid;gap:12px;width:min(92vw,520px);pointer-events:none;z-index:1000}.toast[_ngcontent-%COMP%]{pointer-events:auto;display:grid;grid-template-columns:auto 1fr auto;align-items:start;gap:10px;padding:12px 14px;background:color-mix(in oklab,var(--surface) 96%,transparent);border:1px solid var(--border);border-radius:var(--radius, 16px);box-shadow:var(--shadow-1);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);position:relative;overflow:hidden;transition:transform .14s cubic-bezier(.22,.61,.36,1),box-shadow .14s}.toast[_ngcontent-%COMP%]:hover{transform:translateY(-1px);box-shadow:var(--shadow-2)}.ico[_ngcontent-%COMP%]{display:grid;place-items:center;margin-top:2px}.msg[_ngcontent-%COMP%]{color:var(--txt);line-height:1.3}.close[_ngcontent-%COMP%]{display:grid;place-items:center;width:28px;height:28px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--muted);transition:transform .12s ease,background .12s ease,border-color .12s ease}.close[_ngcontent-%COMP%]:hover{transform:translateY(-1px)}.close[_ngcontent-%COMP%]:focus-visible{outline:0;box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 35%,transparent)}.bar[_ngcontent-%COMP%]{position:absolute;left:0;right:0;bottom:0;height:3px;background:color-mix(in oklab,var(--tone, var(--primary)) 60%,transparent);transform-origin:left;animation:_ngcontent-%COMP%_toastbar var(--ttl, 4s) linear forwards;opacity:.85}@keyframes _ngcontent-%COMP%_toastbar{0%{transform:scaleX(1)}to{transform:scaleX(0)}}.toast.info[_ngcontent-%COMP%]{--tone: var(--ring)}.toast.success[_ngcontent-%COMP%]{--tone: var(--ok)}.toast.warn[_ngcontent-%COMP%]{--tone: var(--warn)}.toast.error[_ngcontent-%COMP%]{--tone: var(--err)}.toast[_ngcontent-%COMP%]{border-left:4px solid var(--tone)}.toast-enter[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_toastIn .22s cubic-bezier(.22,.61,.36,1) both}.toast-leave[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_toastOut .16s ease both}@keyframes _ngcontent-%COMP%_toastIn{0%{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}@keyframes _ngcontent-%COMP%_toastOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(8px) scale(.98)}}@media (max-width: 480px){.toasts[_ngcontent-%COMP%]{bottom:12px}.toast[_ngcontent-%COMP%]{padding:12px}}',
    ],
  });
};
var _c = class e {
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-footer']],
    decls: 26,
    vars: 0,
    consts: [
      ['role', 'contentinfo', 1, 'site-footer'],
      [1, 'glow'],
      [1, 'inner', 'container'],
      [
        'href',
        'https://github.com/GustavoDiego',
        'target',
        '_blank',
        'rel',
        'noopener noreferrer',
        'aria-label',
        'GitHub de Gustavo Diego',
        1,
        'made-by',
      ],
      ['aria-hidden', 'true', 1, 'badge'],
      ['name', 'lucideGithub', 1, 'icon-20'],
      [1, 'txt'],
      ['role', 'navigation', 'aria-label', 'A\xE7\xF5es do rodap\xE9', 1, 'actions'],
      [
        'href',
        'https://github.com/GustavoDiego',
        'target',
        '_blank',
        'rel',
        'noopener noreferrer',
        1,
        'pill',
        'gh-btn',
      ],
      ['name', 'lucideGithub', 1, 'icon-18'],
      ['href', '#top', 'aria-label', 'Voltar ao topo', 1, 'pill', 'to-top'],
      ['name', 'lucideArrowUpToLine', 1, 'icon-18'],
      ['aria-label', 'Informa\xE7\xF5es legais', 1, 'meta', 'container'],
      [1, 'copyright'],
      ['aria-hidden', 'true', 1, 'orbs'],
      [1, 'orb', 'o1'],
      [1, 'orb', 'o2'],
      [1, 'orb', 'o3'],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, 'footer', 0),
        E(1, 'div', 1),
        f(2, 'div', 2)(3, 'a', 3)(4, 'div', 4),
        E(5, 'ng-icon', 5),
        v(),
        f(6, 'span', 6),
        M(7, 'feito por '),
        f(8, 'strong'),
        M(9, 'Gustavo Diego'),
        v()()(),
        f(10, 'div', 7)(11, 'a', 8),
        E(12, 'ng-icon', 9),
        f(13, 'span'),
        M(14, 'github.com/GustavoDiego'),
        v()(),
        f(15, 'a', 10),
        E(16, 'ng-icon', 11),
        f(17, 'span'),
        M(18, 'Voltar ao topo'),
        v()()()(),
        f(19, 'div', 12)(20, 'small', 13),
        M(21, '\xA9 2025 Gustavo Diego. Todos os direitos reservados.'),
        v()(),
        f(22, 'div', 14),
        E(23, 'span', 15)(24, 'span', 16)(25, 'span', 17),
        v()());
    },
    dependencies: [ve, je],
    styles: [
      '@charset "UTF-8";.site-footer[_ngcontent-%COMP%]{position:relative;overflow:hidden;margin-top:24px;padding:28px 16px calc(34px + env(safe-area-inset-bottom));background:linear-gradient(180deg,color-mix(in oklab,var(--surface) 92%,transparent),color-mix(in oklab,var(--surface-2) 92%,transparent));border-top:1px solid var(--border)}.site-footer[_ngcontent-%COMP%]   .inner[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:16px;padding-inline:24px}.site-footer[_ngcontent-%COMP%]   .inner[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{min-width:0}.site-footer[_ngcontent-%COMP%]   .actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center}.site-footer[_ngcontent-%COMP%]   .made-by[_ngcontent-%COMP%]{display:inline-flex;flex-wrap:nowrap;align-items:center;justify-content:center;margin-inline:auto;gap:8px;color:var(--muted);text-decoration:none;transition:color .16s var(--ease-out-3),background .16s var(--ease-out-3),transform .16s var(--ease-out-3);padding-inline:8px;max-width:100%;box-sizing:border-box;white-space:nowrap;-webkit-tap-highlight-color:transparent;outline:none}.site-footer[_ngcontent-%COMP%]   .made-by[_ngcontent-%COMP%]:hover, .site-footer[_ngcontent-%COMP%]   .made-by[_ngcontent-%COMP%]:focus-visible{color:var(--txt)}.site-footer[_ngcontent-%COMP%]   .made-by[_ngcontent-%COMP%]:active{background:color-mix(in oklab,var(--primary) 12%,transparent);border-radius:8px;transform:scale(.97)}.site-footer[_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%]{display:inline-grid;place-items:center;width:28px;height:28px;flex:0 0 28px;border-radius:10px;background:radial-gradient(120% 120% at 0% 0%,color-mix(in oklab,var(--primary) 35%,transparent),transparent 60%),radial-gradient(120% 120% at 100% 0%,color-mix(in oklab,var(--mint) 30%,transparent),transparent 60%),radial-gradient(120% 120% at 100% 100%,color-mix(in oklab,var(--teal) 28%,transparent),transparent 60%),var(--surface-2);border:1px solid color-mix(in oklab,var(--primary) 40%,var(--border));box-shadow:0 8px 20px color-mix(in oklab,var(--primary) 16%,transparent);transform:translateZ(0);animation:_ngcontent-%COMP%_float 5.2s var(--ease-smooth) infinite}.site-footer[_ngcontent-%COMP%]   .txt[_ngcontent-%COMP%]{font-size:var(--fs-14);white-space:nowrap;overflow:visible;text-overflow:unset;text-align:center}.site-footer[_ngcontent-%COMP%]   .txt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:var(--txt)}.site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:10px;min-height:40px;padding:8px 16px;border-radius:999px;border:1px solid var(--border);color:var(--txt);text-decoration:none;justify-content:center;text-align:center;transition:transform .14s var(--ease-out-3),box-shadow .14s var(--ease-out-3),border-color .14s var(--ease-out-3),background .14s var(--ease-out-3);flex:0 0 auto;max-width:100%;-webkit-tap-highlight-color:transparent;outline:none}.site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:hover, .site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:focus-visible{transform:translateY(-1px);border-color:color-mix(in oklab,var(--primary) 40%,var(--border));box-shadow:0 10px 26px color-mix(in oklab,var(--primary) 16%,transparent)}.site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:focus{outline:none}.site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:focus-visible{border-color:color-mix(in oklab,var(--teal) 45%,var(--border));box-shadow:0 0 0 3px color-mix(in oklab,var(--teal) 55%,transparent),0 10px 26px color-mix(in oklab,var(--teal) 16%,transparent)}.site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:active{background:color-mix(in oklab,var(--primary) 12%,transparent);transform:scale(.97)}.site-footer[_ngcontent-%COMP%]   .gh-btn[_ngcontent-%COMP%]{background:color-mix(in oklab,var(--primary) 14%,var(--surface-2))}.site-footer[_ngcontent-%COMP%]   .gh-btn[_ngcontent-%COMP%]   .icon-18[_ngcontent-%COMP%]{width:20px;height:20px}.site-footer[_ngcontent-%COMP%]   .to-top[_ngcontent-%COMP%]{background:color-mix(in oklab,var(--teal) 12%,var(--surface-2));border-color:color-mix(in oklab,var(--teal) 40%,var(--border))}.site-footer[_ngcontent-%COMP%]   .glow[_ngcontent-%COMP%]{position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent 0%,color-mix(in oklab,var(--primary) 60%,transparent) 15%,color-mix(in oklab,var(--mint) 60%,transparent) 35%,color-mix(in oklab,var(--teal) 60%,transparent) 55%,color-mix(in oklab,var(--lime) 60%,transparent) 75%,transparent 100%);transform:translate(-30%);animation:_ngcontent-%COMP%_shimmer 3.8s linear infinite}.site-footer[_ngcontent-%COMP%]   .meta[_ngcontent-%COMP%]{margin-top:14px;text-align:center}.site-footer[_ngcontent-%COMP%]   .meta[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%]{color:color-mix(in oklab,var(--muted) 84%,transparent)}.site-footer[_ngcontent-%COMP%]   .orbs[_ngcontent-%COMP%]{position:absolute;inset:0;pointer-events:none}.site-footer[_ngcontent-%COMP%]   .orb[_ngcontent-%COMP%]{position:absolute;width:180px;height:180px;border-radius:50%;filter:blur(28px);opacity:.18}.site-footer[_ngcontent-%COMP%]   .o1[_ngcontent-%COMP%]{left:-40px;bottom:-60px;background:color-mix(in oklab,var(--primary) 45%,transparent);animation:_ngcontent-%COMP%_drift 16s ease-in-out infinite}.site-footer[_ngcontent-%COMP%]   .o2[_ngcontent-%COMP%]{right:10%;bottom:-80px;background:color-mix(in oklab,var(--teal) 45%,transparent);animation:_ngcontent-%COMP%_drift 20s ease-in-out infinite reverse}.site-footer[_ngcontent-%COMP%]   .o3[_ngcontent-%COMP%]{left:45%;bottom:-70px;background:color-mix(in oklab,var(--lime) 40%,transparent);animation:_ngcontent-%COMP%_drift 22s ease-in-out infinite}.site-footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:focus-visible{outline:2px solid color-mix(in oklab,var(--primary) 70%,transparent);outline-offset:3px;border-radius:10px}@media (prefers-reduced-motion: reduce){.site-footer[_ngcontent-%COMP%]   .glow[_ngcontent-%COMP%], .site-footer[_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%], .site-footer[_ngcontent-%COMP%]   .orb[_ngcontent-%COMP%]{animation:none}.site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:hover, .site-footer[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:focus-visible{transform:none;box-shadow:none}}@keyframes _ngcontent-%COMP%_shimmer{0%{transform:translate(-30%)}to{transform:translate(130%)}}@keyframes _ngcontent-%COMP%_float{0%{transform:translateY(0)}50%{transform:translateY(-3px)}to{transform:translateY(0)}}@keyframes _ngcontent-%COMP%_drift{0%{transform:translateY(0) translate(0) scale(1)}50%{transform:translateY(-16px) translate(8px) scale(1.04)}to{transform:translateY(0) translate(0) scale(1)}}@media (max-width: 1024px){.site-footer[_ngcontent-%COMP%]   .inner[_ngcontent-%COMP%]{grid-template-columns:1fr;justify-items:center;text-align:center}.site-footer[_ngcontent-%COMP%]   .made-by[_ngcontent-%COMP%]{justify-content:center;justify-self:center}}@media (max-width: 720px){.site-footer[_ngcontent-%COMP%]   .actions[_ngcontent-%COMP%]{justify-content:center;flex-wrap:wrap;gap:10px}.site-footer[_ngcontent-%COMP%]   .actions[_ngcontent-%COMP%] > .pill[_ngcontent-%COMP%]{flex:0 0 auto}.site-footer[_ngcontent-%COMP%]   .made-by[_ngcontent-%COMP%]{flex-direction:row;gap:6px}}@media (max-width: 500px){.site-footer[_ngcontent-%COMP%]   .inner[_ngcontent-%COMP%]{grid-template-columns:1fr!important;justify-items:center;text-align:center}.site-footer[_ngcontent-%COMP%]   .made-by[_ngcontent-%COMP%]{display:inline-flex;flex-wrap:nowrap;align-items:center;justify-content:center;gap:8px;margin-inline:auto;max-width:fit-content;white-space:nowrap;padding-inline:0;text-align:center}.site-footer[_ngcontent-%COMP%]   .txt[_ngcontent-%COMP%]{white-space:nowrap;overflow:visible;text-overflow:unset;text-align:center}}',
    ],
  });
};
function K8(e, t) {
  e & 1 && E(0, 'ng-icon', 15);
}
function Q8(e, t) {
  e & 1 && E(0, 'ng-icon', 16);
}
var xc = class e {
  constructor(t) {
    this.ui = t;
  }
  isLight = !1;
  ngOnInit() {
    localStorage.getItem('theme') === 'light' &&
      (document.documentElement.classList.add('theme-light'), (this.isLight = !0));
  }
  isModalOpen = !1;
  openModal() {
    this.isModalOpen = !0;
  }
  closeModal() {
    this.isModalOpen = !1;
  }
  toggleTheme() {
    ((this.isLight = !this.isLight),
      document.documentElement.classList.toggle('theme-light', this.isLight),
      localStorage.setItem('theme', this.isLight ? 'light' : 'dark'));
  }
  static ɵfac = function (n) {
    return new (n || e)(I(Ho));
  };
  static ɵcmp = se({
    type: e,
    selectors: [['app-root']],
    decls: 24,
    vars: 3,
    consts: [
      ['role', 'banner', 1, 'app-header'],
      [1, 'header-inner', 'container'],
      [1, 'brand'],
      ['aria-hidden', 'true', 1, 'logo-dot'],
      ['aria-label', 'Navega\xE7\xE3o principal', 1, 'nav'],
      ['href', '#grid', 1, 'pill'],
      ['name', 'lucideCalendar', 1, 'icon-20'],
      [1, 'label'],
      ['type', 'button', 1, 'pill', 'pill-primary', 3, 'click'],
      ['name', 'lucidePlus', 1, 'icon-20'],
      [1, 'actions'],
      ['type', 'button', 'aria-label', 'Alternar tema', 1, 'icon-btn', 3, 'click'],
      ['name', 'lucideSun', 'class', 'icon-18', 4, 'ngIf'],
      ['name', 'lucideMoon', 'class', 'icon-18', 4, 'ngIf'],
      ['aria-hidden', 'true', 1, 'glow-x'],
      ['name', 'lucideSun', 1, 'icon-18'],
      ['name', 'lucideMoon', 1, 'icon-18'],
    ],
    template: function (n, r) {
      (n & 1 &&
        (f(0, 'header', 0)(1, 'div', 1)(2, 'div', 2),
        E(3, 'span', 3),
        f(4, 'h1'),
        M(5, 'Planner de Cadeiras'),
        v()(),
        f(6, 'nav', 4)(7, 'a', 5),
        E(8, 'ng-icon', 6),
        f(9, 'span', 7),
        M(10, 'Hor\xE1rios'),
        v()(),
        f(11, 'button', 8),
        S('click', function () {
          return r.ui.openAddModal.set(!0);
        }),
        E(12, 'ng-icon', 9),
        f(13, 'span', 7),
        M(14, 'Adicionar'),
        v()()(),
        f(15, 'div', 10)(16, 'button', 11),
        S('click', function () {
          return r.toggleTheme();
        }),
        Q(17, K8, 1, 0, 'ng-icon', 12)(18, Q8, 1, 0, 'ng-icon', 13),
        v()()(),
        E(19, 'div', 14),
        v(),
        f(20, 'main'),
        E(21, 'router-outlet'),
        v(),
        E(22, 'app-footer')(23, 'app-toast-container')),
        n & 2 &&
          (m(16),
          Ne('aria-pressed', r.isLight),
          m(),
          A('ngIf', !r.isLight),
          m(),
          A('ngIf', r.isLight)));
    },
    dependencies: [ve, Ve, Qi, je, yc, _c],
    encapsulation: 2,
  });
};
Vu(xc, vm);
