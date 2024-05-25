const API_KEY= "168771779c71f3d64106d8a88376808a";

const userTab=document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const searchForm=document.querySelector("[data-searchForm]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');


let oldTab=userTab; // this sets tab to by default to user tab 
oldTab.classList.add("oldTab");
getfromSessionStorage();

/*this function helps determine on which tab user is therre currently 
and helps in changing bacground to indicate the user the tab on which he 
is located.*/
function switchTab(newTab){
    notFound.classList.remove("active");
    if(newTab != oldTab){
        oldTab.classList.remove("oldTab");/*changed from current-tab to oldTab*/
        oldTab=newTab;
        oldTab.classList.add("oldTab");

        if(!searchForm.classList.contains("active")){
            //kya search wala form is invisible ,if yes then make it visible
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        }
        else{
            //main pehle search wale pr tha, ab your weather tab pr aana hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather wale tab me aagya hu, toh weather bhi display karna padega
            getfromSessionStorage();

        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);

});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);

});

/*hum check karte hai ki if i already have the cordinates if yes then i call the else part where json
file help me to get the information saved into a variable called coordinates*/
 function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mile toh
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
 }

 async function fetchUserWeatherInfo(coordinates){
    const { lat , lon }  = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader invisible
    loadingScreen.classList.add("active");
 }

 //API CALL
 try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data= await response.json();

    //marking
    if (!data.sys) {
        throw data;
    }

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
catch(err){
    loadingScreen.classList.remove("active");
    //hw
    notFound.classList.add('active');
    errorImage.style.display = 'none';
    errorText.innerText = `Error: ${err?.message}`;
    errorBtn.style.display = 'block';
    errorBtn.addEventListener("click", fetchUserWeatherInfo);
}

//after switching from search to user bar the weather info
// should be displayed
function renderWeatherInfo(weatherInfo){

    //firstly we have to fetch the elements
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");


    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;

}
    const grantAccessButton=document.querySelector("[data-grantAccess]");

    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);

        }
        else{
            grantAccessButton.style.display='none';
        }
    }

    function showPosition(position){

        const userCoordinates = {
            lat: position.coord.latitude, /*lat: position.coords.latitude,*/
            lon: position.coord.longitude,

        };

        sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));/*User co-ordinates*/
        fetchUserWeatherInfo(userCoordinates);

    }

    grantAccessButton.addEventListener("click", getLocation);

    const searchInput=document.querySelector("[data-searchInput]");

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let cityName=searchInput.value;

        if(cityName==="")
            return;
        fetchSearchWeatherInfo(cityName);

    });

    async function fetchSearchWeatherInfo(city){
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        notFound.classList.remove("active");

        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data = await response.json();

            
            if (!data.sys) {
                throw data;
            }
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);


        }
        catch(err){
            //HW
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
        }


    }










