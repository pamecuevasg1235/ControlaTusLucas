let datos = JSON.parse(localStorage.getItem("datos")) || [];

function guardarStorage(){
  localStorage.setItem("datos", JSON.stringify(datos));
}

function abrir(){
  document.getElementById("modal").style.display="flex";
}

function cerrar(){
  document.getElementById("modal").style.display="none";
}

function guardar(){
  let nombre = document.getElementById("nombre").value;
  let monto = parseFloat(document.getElementById("monto").value);
  let tipo = document.getElementById("tipo").value;

  if(!nombre || !monto){
    alert("Completa los datos");
    return;
  }

  datos.push({
    nombre,
    monto,
    tipo
  });

  guardarStorage();
  cerrar();
  mostrar();
}

function mostrar(){
  let lista = document.getElementById("lista");
  lista.innerHTML="";

  let total = 0;

  datos.forEach(d=>{
    let div = document.createElement("div");
    div.innerHTML = d.nombre + " - $" + d.monto;
    lista.appendChild(div);

    if(d.tipo === "ingreso") total += d.monto;
    else total -= d.monto;
  });

  document.getElementById("saldo").innerText = "$" + total;
}

function nombreUsuario(){
  let nombre = localStorage.getItem("nombre");

  if(!nombre){
    nombre = prompt("¿Cómo te llamas?");
    localStorage.setItem("nombre", nombre);
  }

  document.getElementById("saludo").innerText = "Hola " + nombre + " 👋";
}

nombreUsuario();
mostrar();
