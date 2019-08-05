import React from 'react';
import logo from './logo.svg';
import {Subscription} from './Spy/Spy';
import BreadCrumbs, {BreadCrumb} from './BreadCrumbs/BreadCrumbs';
import './App.css';

declare var window: any;

interface IState {
    crumbs: BreadCrumb[]
}

class App extends React.Component<any, IState> {

    private _crumbs: BreadCrumbs;
    private _crumbsSubscription: Subscription;

    state = {
        crumbs: []
    }

    constructor(props: any) {
        super(props);
        this._crumbs = new BreadCrumbs();

        window.crumbs = this._crumbs;
    }
    
    componentDidMount() {
        this._crumbsSubscription = this._crumbs.crumbsObservable.subscribe(this.log.bind(this))
    }

    componentWillUnmount() {
        this._crumbsSubscription.unsubscribe();
    }

    log(val: any) {
        console.log('val', val)
        this.setState({
            crumbs: val
        })
    }

    render() {
        console.log();
        return (
            <div className="App">
                <div className='crumbs'>
                    {this.state.crumbs.map((c: BreadCrumb) => <span key={c.name}>{c.name}</span>)}
                </div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }
}

export default App;
