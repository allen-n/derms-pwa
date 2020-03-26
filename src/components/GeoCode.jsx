import React, { useEffect, useState } from "react";
import { withLeaflet } from "react-leaflet";
import Geocoder from "leaflet-control-geocoder"
import { mapBoxConfig } from '../firebase/config'

const GeoCode = props => {
    const [gc, setGc] = useState(null)

    const initMapBoxOptions = (props) => {
        const delta = props.delta
        const limit = props.limit
        const boundBox = [props.searchLoc.lng - delta, props.searchLoc.lat - delta, props.searchLoc.lng + delta, props.searchLoc.lat + delta] //[minLon,minLat,maxLon,maxLat]
        var bBoxString = "" + boundBox.join(",")
        // boundBox.forEach(val => {
        //     bBoxString += String(val) + "%2C"
        // })
        const mapBoxOptions = {
            geocodingQueryParams: {
                proximity: props.searchLoc,
                limit: limit,
                bbox: bBoxString
            },
            reverseQueryParams: {
            }
        }
        return mapBoxOptions
    }

    const mapBoxOptions = initMapBoxOptions(props);

    const options = {};
    // Config options from: https://github.com/perliedman/leaflet-control-geocoder
    options.collapsed = false	// Collapse  control unless hovered/clicked
    options.expand = "touch" //	How to expand a collapsed control: touch or click or hover
    options.position = "topright" //	Control position
    options.placeholder = "Search..." //	Placeholder text for text input
    options.errorMessage = "Nothing found." //	Message when no result found / geocoding error occurs
    options.iconLabel = "Initiate a new search"	// Accessibility label for the search icon used by screen readers
    options.geocoder = new Geocoder.Mapbox(mapBoxConfig.apiKey, mapBoxOptions)	// Object to perform the actual geocoding queries, Nominatim() is default
    options.showUniqueResult = true	// Immediately show the unique result without prompting for alternatives
    options.showResultIcons = false	// Show icons for geocoding results (if available); supported by Nominatim
    options.suggestMinLength = 3	//Minimum // number characters before suggest functionality is used (if available from geocoder)
    options.suggestTimeout = 250	//Number // of milliseconds after typing stopped before suggest functionality is used (if available from geocoder)
    options.query = ""	//Initial // query string for text input
    options.queryMinLength = 3 //	Minimum number of characters in search text before performing a query



    useEffect(() => {
        // console.log(options)
        const { map } = props.leaflet;
        var myGc = new Geocoder(options);
        myGc.addTo(map); // Leave out options for default
        setGc(myGc)

    }, [])

    // TODO@ALLEN: This introduces an error, but without it we cannot search anywhere except the 
    // location when we initialize the page. I guess this will limit bad behavior?

    // useEffect(() => {
    //     if (gc != null) {
    //         gc.options.geocoder.options = initMapBoxOptions(props)
    //         // console.log(gc.options.geocoder.options)
    //     }


    // }, [props.searchLoc])

    return null
}

GeoCode.defaultProps = {
    delta: .1,
    limit: 3,
}

export default withLeaflet(GeoCode);


