import Observable from '../Spy/Spy';


export class BreadCrumb {
    private _name: string;
    private _data: any;
    constructor(name: string, data: any) {
        this._name = name;
        this._data = data;
    }

    get name() {
        return this._name;
    }
}


class BreadCrumbs {
    private _crumbs: BreadCrumb[] = [];
    public crumbsObservable = new Observable((observable) => {
        console.log('observable', observable)
        observable.call(this._crumbs);
        // observable.next(this._crumbs);
    });

	private _update() {
        this.crumbsObservable.publish(this._crumbs)
    }
    
    add(name: string, data?: any) {
        this._crumbs.push(new BreadCrumb(name, data));
        this._update();
    }

    remove(name: string) {
        this._crumbs = this._crumbs.filter(crumb => crumb.name !== name);
        this._update();
    }


}

export default BreadCrumbs;