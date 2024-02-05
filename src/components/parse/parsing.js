export function parseSkyScrapperResponse(response) {
    const resultObject = {
        itineraries: [],
    };
    if (response && response.status) {
        const itineraries = response.data.itineraries;
        itineraries.forEach((itinerary, index) => {
            const companyLogo = itinerary.legs[0].carriers.marketing[0].logoUrl;
            const companyName = itinerary.legs[0].carriers.marketing[0].name;
            const parsedData = {
                id: itinerary.id,
                price: itinerary.price.formatted,
                departure: itinerary.legs[0].departure.split('T')[1].split(':').slice(0, 2).join(':'),
                arrival: itinerary.legs[0].arrival.split('T')[1].split(':').slice(0, 2).join(':'),
                direct: itinerary.legs[0].stopCount ,
                duration: formatMinutes(itinerary.legs[0].durationInMinutes),
                displayCode: itinerary.legs[0].origin.id + '-' + itinerary.legs[0].destination.id,
                company: companyLogo,
                name: companyName,
                origin: itinerary.legs[0].origin.id,
                destination: itinerary.legs[0].destination.id,
                favorite: false,
            };
            resultObject.itineraries.push(parsedData);
        });
    } else {
        resultObject.error = "Parsing error!";
    }
    return resultObject;
}
function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');

    return `${formattedHours}h${formattedMinutes}min`;
}