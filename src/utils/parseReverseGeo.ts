export function parseReverseGeo(geoData: any) {
	var cityName, stateName, countryName, returnStr;
	if (geoData.context) {
		geoData.context.forEach((v: any) => {
			if (v.id.indexOf('place') >= 0) {
				cityName = v.text;
			}
			if (v.id.indexOf('region') >= 0) {
				stateName = v.text;
			}
			if (v.id.indexOf('country') >= 0) {
				countryName = v.text;
			}
		});
	}
	if (cityName && stateName && countryName) {
		returnStr = cityName + ', ' + stateName + ', ' + countryName;
	} else {
		returnStr = geoData.place_name;
	}
	if (returnStr.length > 32 && cityName && countryName) {
		returnStr = cityName + ', ' + countryName;
	}
	return returnStr;
}
