function searchLoc() {

    // constante con lista de audios para chile
    const apiUrl1 = `https://xeno-canto.org/api/2/recordings?query=cnt:chile`;

    fetch(apiUrl1)
        .then(response => {
            console.log('API response status:', response.status);
            return response.json();
        })
        .then(data => {
            const resultSelect = document.getElementById('locSeleccionado');
            resultSelect.innerHTML = '<option value="" disabled selected>Selecciona una localidad</option>';

            if (data.recordings && data.recordings.length > 0) {
                const uniqueLocations = new Set();

                data.recordings.forEach(recording => {
                    uniqueLocations.add(recording.loc);
                });

                uniqueLocations.forEach(location => {
                    const option = document.createElement('option');
                    option.value = location;
                    option.textContent = location;
                    resultSelect.appendChild(option);
                });

                // Agrega el listener de 'change', después de que las opciones estén cargadas
                resultSelect.addEventListener('change', function() {
                    const selectedLocation = this.value;
                    // Llamada al hacer clic en el botón.
                    console.log('Localidad seleccionada:', selectedLocation); // Para verificar que se obtiene la localidad
                });

            } else {
                resultSelect.innerHTML = '<option value="" disabled selected>No se encontraron localidades</option>';
                swal("Lo sentimos!", "No se encontraron localidades!", "error");
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const resultSelect = document.getElementById('locSeleccionado');
            resultSelect.innerHTML = '<option value="" disabled selected>Error al cargar localidades</option>';
            swal("Lo sentimos!", "Error al cargar localidades!", "error");
        });
}


function searchBirds(selectedLocation) {
    // se agrega a la busqueda con localidad seleccionada
    const encodedLoc = encodeURIComponent(selectedLocation);
    let apiUrl = `https://xeno-canto.org/api/2/recordings?query=cnt:chile+loc:"${encodedLoc}`;

    //console.log(`API URL ${apiUrl}`);

    fetch(apiUrl)
        .then(response => {
            console.log('API response status:', response.status);
            return response.json();
        })
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            // si consulta es >0 crea lista de audios
            if (data.recordings && data.recordings.length > 0) {
                data.recordings.forEach(recording => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <h2>Nombre científico:</h2>
                        <h2>${recording.en} <i>${recording.sp}</i></h2>
                        <h3Nombre especie: ${recording.gen}</h3>
                        <p>Localidad de grabación: ${recording.loc}</p>
                        <p>Autor audio: ${recording.rec}</p>
                        <p>ID de Grabación: ${recording.id}</p>
                        <p>Latitud: ${recording.lat}</p>
                        <p>Longitud: ${recording.lng}</p>
                        <br>
                        <audio controls>
                            <source src="${recording.file}" type="audio/mpeg">
                        </audio>
                        <hr>
                    `;
                    resultsDiv.appendChild(div);//se agrega a DOM lista según busqueda
                });
            } else {
                //resultsDiv.innerHTML = '<p>No se encontraron grabaciones para esta búsqueda, intente con una nueva localidad</p>';
                swal("Lo sentimos!", "No se encontraron audios para esta búsqueda, intente con una nueva localidad!", "error");
            }
        })
        .catch(error => {
            console.error('Error fetching bird data:', error);
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p>Error al obtener las grabaciones. Intente nuevamente.</p>';
            swal("Lo sentimos!", "Error al obtener los audios. Intente nuevamente.", "error");
        });
}

function buscarGrabaciones() {
    const selectElement = document.getElementById('locSeleccionado');
    const selectedLocation = selectElement.value;

    if (selectedLocation) {
        searchBirds(selectedLocation);
    } else {
       // alert('Por favor, selecciona una localidad antes de buscar.');
        swal("Intente nuevamente", "Selecciona una localidad antes de buscar", "warning");
    }
}

function limpiarBusqueda() {
    // Limpiar el div de resultados
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    // Restablece el desplegable de localidades a su estado inicial
    const locSeleccionado = document.getElementById('locSeleccionado');
    locSeleccionado.value = 'Selecciona una localidad'; // Esto seleccionará la primera opción
}

// Llama a searchLoc para cargar las localidades al cargar la página
searchLoc();
