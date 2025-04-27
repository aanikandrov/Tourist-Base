import {useAuth} from '../AuthContext';

import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import 'ol/ol.css';
import './css/InfoPage.css';
import logo from "./assets/MountainsLogo.png";
import { useNavigate } from 'react-router-dom';


const InfoPage = () => {
    const mapRef = useRef(null);
    const coordinates = [43.148106, 43.110734];
    const markerCoordinates = fromLonLat(coordinates);
    const navigate = useNavigate();
    const {user} = useAuth();

    const handleOpenMap = (service) => {
        const [lon, lat] = coordinates;
        const urls = {
            yandex: `https://yandex.ru/maps/?pt=${lon},${lat}&z=18&l=map`,
            google: `https://www.google.com/maps/@${lat},${lon},15z`
        };
        window.open(urls[service], '_blank');
    };

    useEffect(() => {
        if (!mapRef.current) return;

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                scale: 0.5
            })
        });

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [
                    new Feature({
                        geometry: new Point(markerCoordinates)
                    })
                ]
            }),
            style: iconStyle
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer
            ],
            view: new View({
                center: markerCoordinates,
                zoom: 15
            })
        });

        map.on('click', (event) => {
            const feature = map.forEachFeatureAtPixel(
                event.pixel,
                (feature) => feature
            );

            if (feature) {
                const [lon, lat] = coordinates;
                const url = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
                window.open(url, '_blank');
            }
        });

        map.on('pointermove', (event) => {
            map.getTargetElement().style.cursor = map.hasFeatureAtPixel(event.pixel)
                ? 'pointer'
                : '';
        });

        return () => map.setTarget(undefined);
    }, []);

    return (
        <div className="container">
            <div className="top-bar">
                <div className="logo-container">
                    <img src={logo} alt="Логотип Турбазы" className="logo" />
                    <span className="logo-text">Турбаза Курсовая</span>
                </div>

                <div className="nav-buttons">
                    <button className="nav-button" onClick={() => navigate('/main')}>Главная</button>
                    <button className="nav-button" onClick={() => navigate('/itemrent')}>Бронирование</button>
                    <button className="nav-button" onClick={() => navigate('/about')}>О нас</button>
                    <button className="nav-button bold" onClick={() => navigate('/info')}>Контакты</button>
                    <button className="nav-button dashboard-button" onClick={() => navigate('/userPanel')}>{user ? "Личный кабинет" : "Войти"}</button>
                </div>
            </div>

            <div className="info-content">
                <div className="contacts-column">
                    <h2 className="contacts-title">Контактная информация</h2>
                    <div className="contacts-list">
                        <div className="contact-field">
                            <label>Телефон для бронирования:</label>
                            <input type="text" value="+9 (999) 999-99-99" readOnly />
                        </div>
                        <div className="contact-field">
                            <label>Телефон администратора:</label>
                            <input type="text" value="+9 (999) 999-99-99" readOnly />
                        </div>
                        <div className="contact-field">
                            <label>Экстренный телефон:</label>
                            <input type="text" value="+9 (999) 999-99-99" readOnly />
                        </div>
                        <div className="contact-field">
                            <label>Электронная почта:</label>
                            <input type="text" value="info@kursovaya.ru" readOnly />
                        </div>
                    </div>
                </div>

                <div className="map-column">

                    <div ref={mapRef} className="map-container"></div>
                    <div className="map-buttons">
                        <button className="map-btn yandex" onClick={() => handleOpenMap('yandex')}>
                            Яндекс.Карты
                        </button>
                        <button className="map-btn google" onClick={() => handleOpenMap('google')}>
                            Google Maps
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;