let datos = JSON.parse(localStorage.getItem("datos")) || [];
let metas = JSON.parse(localStorage.getItem("metas")) || [];

const tasas = {
  USD:900,
  EUR:1000,
  CLP:1
};

function guardar(){
  localStorage.setItem("datos", JSON.stringify(datos));
  localStorage.setItem("metas", JSON.stringify(metas));
}

function abrirModal(){modal.style.display="flex";}
function cerrarModal(){modal.style.display="none";}

function agregar(){
  let nombre=nombreEl.value;
  let monto=parseFloat(montoEl.value);
  let moneda=monedaEl.value;
  let tipo=tipoEl.value;
  let categoria=categoriaEl.value;

  if(!nombre||!monto) return;

  datos.push({
    id:Date.now(),
    nombre,monto,moneda,tipo,categoria
  });

  guardar();
  cerrarModal();
  mostrar();
}

function eliminar(id){
  datos=datos.filter(d=>d.id!==id);
  guardar();
  mostrar();
}

function convertir(m,mon){return m*tasas[mon];}

function mostrar(){
  let saldo=0;
  lista.innerHTML="";
  let catTotal={};

  datos.forEach(d=>{
    let v=convertir(d.monto,d.moneda);

    if(d.tipo==="gasto"){
      saldo-=v;
      catTotal[d.categoria]=(catTotal[d.categoria]||0)+v;
    }else saldo+=v;

    lista.innerHTML+=`
      <div class="item">
        <span>${d.nombre} (${d.categoria})</span>
        <span>
          ${d.tipo==="gasto"?"-":"+"}$${d.monto}
          <button onclick="eliminar(${d.id})">❌</button>
        </span>
      </div>`;
  });

  saldoEl.innerText="$"+saldo.toLocaleString();

  // gráfico
  grafico.innerHTML="";
  let total=Object.values(catTotal).reduce((a,b)=>a+b,0);

  for(let c in catTotal){
    let p=(catTotal[c]/total)*100;
    grafico.innerHTML+=`
      <div>${c} (${p.toFixed(0)}%)</div>
      <div class="bar"><div class="bar-fill" style="width:${p}%"></div></div>`;
  }

  mostrarMetas(saldo);
}

function crearMeta(){
  let nombre=prompt("Nombre meta");
  let objetivo=parseFloat(prompt("Monto objetivo"));

  metas.push({id:Date.now(),nombre,objetivo});
  guardar();
  mostrar();
}

function mostrarMetas(saldo){
  metasEl.innerHTML="";
  metas.forEach(m=>{
    let p=(saldo/m.objetivo)*100;
    metasEl.innerHTML+=`
      <div>${m.nombre}</div>
      <div class="bar"><div class="bar-fill" style="width:${p}%"></div></div>`;
  });
}

function detectar(){
  let texto = document.getElementById("correo").value;

  let monto = texto.match(/\$?\d+[\.,]?\d*/);
  let nombre = texto.split(" ").slice(0,3).join(" ");

  if(monto){
    datos.push({
      id: Date.now(),
      nombre: nombre,
      monto: parseFloat(monto[0].replace(/[^\d]/g,"")),
      moneda:"CLP",
      tipo: "gasto",
      categoria:"Otros"
    });

    guardar();
    mostrar();
    alert("Gasto detectado 💥");
  }
}

mostrar();
