type Unsubscribe = (id: Symbol) => void
interface IObservable {
    callback: (val: any) => void;
    unsubscribe: Unsubscribe;
}

export class Subscription {

    public _id: Symbol;
    get id() {
        return this._id;
    }
    /**
     * The callback is run each time the observable publishes an upate
     */
    public callback: IObservable['callback'];
    private _unsubscribe: Unsubscribe;

	constructor(callback: IObservable['callback'], unsubscribe: IObservable['unsubscribe']) {
		this.callback = callback;
		this._id = Symbol('Subscription')
		this._unsubscribe = unsubscribe
    } 

	unsubscribe() {
		this._unsubscribe(this.id)
    }
}

type RunOnSubscribeCallback = (observable: Observable) => void

class Observable {
    private _runOnSubscribeCallback: RunOnSubscribeCallback;
    private _subscriptions: Subscription[];
    private _isComplete: boolean;
    private _current: any;
	get current() {
		return this._current;
    }

	constructor(callback: RunOnSubscribeCallback) {
		this._runOnSubscribeCallback = callback;
		this._subscriptions = []
		this._isComplete = false;
        this._current = null;
    }

	public subscribe(callback: IObservable['callback']) {
		const subscription = new Subscription(callback, this._unsubscribe.bind(this));
		this._subscriptions.push(subscription);
        this._runOnSubscribeCallback(this);
		return subscription;
    }

    public call(val: any) {
        const target = this._subscriptions[this._subscriptions.length - 1];
        this._next(val, target.id);
    }

    public publish(val: any) {
        this._next(val);
    }
	
	public complete() {
		this._isComplete = true;
		console.log('Complete!')
    }

	public error() {
		console.log('Error!')
    }
	
	private _next(val: any, id?: Symbol) {
		if (!this._isComplete) {
            this._current = val;
            if (!id) {
                this._subscriptions.forEach(subscription => 
                    subscription.callback(val))
            } else {
                console.log('id', id);
                const targetSubscription = this._subscriptions.find(sub => sub.id === id);
                if (targetSubscription) {
                    targetSubscription.callback(val);
                } else {
                    return false;
                }
            }
			return true;
        } else {
			return false;
        }
    }

	private _unsubscribe(subscriptionId: Symbol) {
		this._subscriptions = this._subscriptions.filter(subscription => subscription.id !== subscriptionId);
    }
	
}

export default Observable;


// use
// var observable = new Observable(subscriber => {
//   console.log('subscriber', subscriber)
	
// // 	setInterval(() => {
// // 		subscriber.next('hi')
// // 	}, 1000);

//   subscriber.next(1);
//   subscriber.next(2);
//   subscriber.next(3);
//   setTimeout(() => {
//     subscriber.next(4);
// //     subscriber.complete();
//   }, 1000);
// })
// var sub1 = observable.subscribe((x) => console.log('sub1', x))


/**
 * Spy
 */
// interface EventItem {
//     id: Symbol;
//     callback: (a: any) => void;
// }

// export class Spy {
//     constructor() {
//         this._events = new Map();
//     }

//     /**
//      * Properties & Getters/Setters
//      */
//     // ===== Start Private Properties ===== //
//     private _events: Map<string, Array<EventItem>>;
//     // ===== End Private Properties ===== //

//     // ===== Start Protected Properties ===== //
//     // ===== End Protected Properties ===== //

//     // ===== Start Public Properties ===== //
//     // ===== End Public Properties ===== //

//     /**
//      * Methods
//      */
//     // ===== Start Private Methods ===== //
//     private _eventIsInMap(eventName: string): boolean {
//         return this._events.has(eventName);
//     }

//     private _addEvent(eventName: string, callback: () => void): Symbol | false {
//         try {
//             let id = Symbol(eventName);
//             if (!this._eventIsInMap(eventName)) {
//                 this._events.set(eventName, [
//                     {
//                         id,
//                         callback,
//                     },
//                 ]);
//             } else {
//                 this._events.get(eventName).push({
//                     id,
//                     callback,
//                 });
//             }
//             return id;
//         } catch (err) {
//             return false;
//         }
//     }
//     // ===== End Private Methods ===== //

//     // ===== Start Protected Methods ===== //
//     // ===== End Protected Methods ===== //

//     // ===== Start Public Methods ===== //
//     public dispatch(eventName: string, detail?: any): boolean {
//         if (this._eventIsInMap(eventName)) {
//             this._events.get(eventName).forEach(({ callback }: EventItem) => {
//                 callback(detail);
//             });
//             return true;
//         } else {
//             return false;
//         }
//     }

//     public listen(eventName: string, callback: () => void): Symbol | false {
//         return this._addEvent(eventName, callback);
//     }

//     public removeListener(eventName: string, id: Symbol): boolean {
//         try {
//             const filteredItems = this._events
//                 .get(eventName)
//                 .filter((eventItem: EventItem) => eventItem.id !== id);

//             if (filteredItems.length === 0) {
//                 this._events.delete(eventName);
//             } else {
//                 this._events.set(eventName, filteredItems);
//             }
//             return true;
//         } catch (err) {
//             return false;
//         }
//     }
//     // ===== End Public Methods ===== //
// }

// export default Spy;

/**
 * Functions
 */
// import Spy from './Spy';

// const spy = new Spy();

// export function observable(eventName, eventPackage?: any) {
//     return function _observable(target: Object, propertyName: string) {
//         // property value
//         let _val = target[propertyName];

//         // property getter method
//         const getter = () => {
//             return _val;
//         };

//         // property setter method
//         const setter = newVal => {
//             spy.dispatch(eventName, eventPackage);
//             _val = newVal;
//         };

//         // Delete property.
//         if (delete target[propertyName]) {
//             // Create new property with getter and setter
//             Object.defineProperty(target, propertyName, {
//                 get: getter,
//                 set: setter,
//                 enumerable: true,
//                 configurable: true,
//             });
//         }
//     };
// }

// export function observe(
//     eventName: string,
//     callback: (eventPackage?: any) => void
// ) {
//     return spy.listen(eventName, callback);
// }

// export function dispatch(eventName: string, eventPackage?: any) {
//     spy.dispatch(eventName, eventPackage);
// }

// export function unobserve(eventName: string, id: Symbol | false): boolean {
//     if (id) {
//         return spy.removeListener(eventName, id);
//     } else {
//         return false;
//     }
// }

// export default spy;