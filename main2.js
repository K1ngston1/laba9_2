document.getElementById('myBtn').addEventListener('click', getData);
document.getElementById('sortOptions').addEventListener('change', sortData);

const filterInputs = document.querySelectorAll('#filterName, #filterLocation, #filterEmail, #filterAge');
filterInputs.forEach(input => {
    input.addEventListener('input', debounce(filterData, 300));
});

let loading = false;

let author = [];

function getData() {
    if (!loading) {
        loading = true;
        // Get API
        fetch('https://randomuser.me/api/?results=100')
        .then(res => res.json())
        .then(data => {
            author = author.concat(data.results);
            displayData(author);
            loading = false;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loading = false;
        });
        console.log('Data requested');
    }
}
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        getData();
    }
});

function displayData(data) {
    let output = "<h2><center>Get User Data</center></h2>";
    data.forEach(function(lists) {
        output += `
            <div class="container">
                <div class="card mt-4 bg-light">
                    <ul class="list-group">
                        <li class="list-group-item"><h2>Name: ${lists.name.first} ${lists.name.last}</h2></li>
                        <li class="list-group-item"><img src="${lists.picture.large}" alt="User Image"></li>
                        <li class="list-group-item">Phone Number: ${lists.cell}</li>
                        <li class="list-group-item">DOB: ${new Date(lists.dob.date).toLocaleDateString()}</li>
                        <li class="list-group-item">Age: ${lists.dob.age}</li>
                        <li class="list-group-item">Email ID: ${lists.email}</li>
                        <li class="list-group-item">Gender: ${lists.gender}</li>
                        <li class="list-group-item">City: ${lists.location.city}</li>
                        <li class="list-group-item">Country: ${lists.location.country}</li>
                        <li class="list-group-item">PostCode: ${lists.location.postcode}</li>
                    </ul>
                </div>
            </div>`;
    });
    document.getElementById("output").innerHTML = output;
}

function sortData() {
    const sortOption = document.getElementById('sortOptions').value;
    let sortedData = [...author]; // Copy the array to avoid modifying the original data

    switch(sortOption) {
        case 'nameAsc':
            sortedData.sort((a, b) => a.name.first.localeCompare(b.name.first));
            break;
        case 'nameDesc':
            sortedData.sort((a, b) => b.name.first.localeCompare(a.name.first));
            break;
        case 'ageAsc':
            sortedData.sort((a, b) => a.dob.age - b.dob.age);
            break;
        case 'ageDesc':
            sortedData.sort((a, b) => b.dob.age - a.dob.age);
            break;
        case 'regDateAsc':
            sortedData.sort((a, b) => new Date(a.registered.date) - new Date(b.registered.date));
            break;
        case 'regDateDesc':
            sortedData.sort((a, b) => new Date(b.registered.date) - new Date(a.registered.date));
            break;
        default:
            break;
    }

    displayData(sortedData);
    updateUrlParams();
}

function filterData() {
    const nameFilter = document.getElementById('filterName').value.toLowerCase();
    const locationFilter = document.getElementById('filterLocation').value.toLowerCase();
    const emailFilter = document.getElementById('filterEmail').value.toLowerCase();
    const ageFilter = document.getElementById('filterAge').value;

    const filteredData = author.filter(person => {
        const fullName = `${person.name.first.toLowerCase()} ${person.name.last.toLowerCase()}`;
        const location = `${person.location.city.toLowerCase()}, ${person.location.country.toLowerCase()}`;
        const email = person.email.toLowerCase();
        const age = person.dob.age;

        return (
            (!nameFilter || fullName.includes(nameFilter)) &&
            (!locationFilter || location.includes(locationFilter)) &&
            (!emailFilter || email.includes(emailFilter)) &&
            (!ageFilter || age == ageFilter)
        );
    });

    displayData(filteredData);
    updateUrlParams();
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromUrlParams();
    document.getElementById('myBtn').addEventListener('click', getData);
    document.getElementById('sortOptions').addEventListener('change', sortData);

    const filterInputs = document.querySelectorAll('#filterName, #filterLocation, #filterEmail, #filterAge');
    filterInputs.forEach(input => {
        input.addEventListener('input', debounce(filterData, 300));
    });
});

function loadDataFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortOption = urlParams.get('sort');
    const nameFilter = urlParams.get('name');
    const locationFilter = urlParams.get('location');
    const emailFilter = urlParams.get('email');
    const ageFilter = urlParams.get('age');
    if (sortOption) {
        document.getElementById('sortOptions').value = sortOption;
    }
    document.getElementById('filterName').value = nameFilter || '';
    document.getElementById('filterLocation').value = locationFilter || '';
    document.getElementById('filterEmail').value = emailFilter || '';
    document.getElementById('filterAge').value = ageFilter || '';
    getData();
}

function updateUrlParams() {
    const sortOption = document.getElementById('sortOptions').value;
    const nameFilter = document.getElementById('filterName').value;
    const locationFilter = document.getElementById('filterLocation').value;
    const emailFilter = document.getElementById('filterEmail').value;
    const ageFilter = document.getElementById('filterAge').value;

    const urlParams = new URLSearchParams();
    urlParams.set('sort', sortOption);
    urlParams.set('name', nameFilter);
    urlParams.set('location', locationFilter);
    urlParams.set('email', emailFilter);
    urlParams.set('age', ageFilter);

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
}

