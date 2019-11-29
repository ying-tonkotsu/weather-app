import React from 'react';
import axios from "axios";
import { myKey } from "./key";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faTint } from '@fortawesome/free-solid-svg-icons';
import { faWind } from '@fortawesome/free-solid-svg-icons';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons';


const API_ENDPOINT = 'http://api.openweathermap.org/data/2.5/forecast';
const cloud = <FontAwesomeIcon icon={faCloud} />
const tint = <FontAwesomeIcon icon={faTint} />
const wind = <FontAwesomeIcon icon={faWind} />
const meter = <FontAwesomeIcon icon={faTachometerAlt} />
const tempHalf = <FontAwesomeIcon icon={faThermometerHalf} />


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKey : myKey,
            requestCity: '',         //  ex. 'Tokyo,jp'
            city: '',
            response: [],
            request_line : 7
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleGetWeather = this.handleGetWeather.bind(this);
    }
    handleGetWeather(){
        axios
            .get(API_ENDPOINT, {
                params: {
                    q: this.state.requestCity,
                    APPID: this.state.apiKey,
                } })
            .then(res => {
                this.setState({
                    response: res.data.list,
                    city: res.data.city.name
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    handleInput({ target: { value } }) {
        this.setState({
            requestCity: value,
            request_line : 1
        });
    }
    render() {
        console.log(this.state.response);
        let res = this.state.response;

        const list = Object.keys(res).map(key => {
            const rk = res[key]
            let temp = rk.main.temp - 273.15;
            const tempLevel = (() => {
                if (temp <= 10) {
                    return "cold";
                } if(25 <= temp) {
                    return "hot";
                }else {
                    return "warm";
                }
            })();
            let imgUrl = 'http://openweathermap.org/img/wn/' + rk.weather[0].icon + '.png';
            let nightIcon = 'n' + rk.weather[0].icon;
            return (
                <li key={key} className={tempLevel}>
                    <p className="date">{rk.dt_txt}</p>
                    <div className="flex bottom">
                        <div className="icons">
                            <div className={nightIcon}>
                                <img src= {imgUrl} />
                            </div>
                            <p className="main">{rk.weather[0].main}</p>
                        </div>
                        <div className="temp flex">
                            <h3><span>{tempHalf}</span>{Math.round(temp)}°C</h3>
                        </div>
                        <div className="details">
                            <p> <span>{cloud}</span>clouds:{rk.clouds.all} %</p>
                            <p> <span>{tint}</span>humidity:{rk.main.humidity} %</p>
                            <p> <span>{meter}</span>grnd level:{rk.main.grnd_level} hPa</p>
                            <p> <span>{wind}</span>wind speed:{rk.wind.speed} m/s</p>
                        </div>
                    </div>
                </li>
            );
         });
        return (
            <div className="mother flex">
                <div className="leftBar">
                    <h1>Weather forecast</h1>
                    <input type="text" placeholder="city name" value={this.state.requestCity} onChange={this.handleInput} />
                    <button onClick={this.handleGetWeather}><i className="fas fa-search fa-spin"></i></button>
                    <p className="location"> Location: {this.state.city} </p>
                </div>
                <div className="rightBar">
                    <ul>
                    { list }
                    </ul>
                </div>
            </div>
        )
    };
}