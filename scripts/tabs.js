function covidTab(evt, contentCovid) {
    // Variable spar acargar TABs
    var i, tabcontent, tablinks;
  
    // Obtener elementso con  class="tabcontent" y ocultarlos
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Tomar todos los elementos con class="tablinks" y remover la clase activa
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Mostrar información en la pestaña ACTUAL, y añadir la clase al boton que abre la pestaña
    document.getElementById(contentCovid).style.display = "block";
    evt.currentTarget.className += " active";
  }