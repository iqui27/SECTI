const toggleButton=document.querySelector('.toggle-button');toggleButton.addEventListener('click',()=>{document.body.classList.toggle('dark')});function enviarEmail(event){event.preventDefault();var nome=document.getElementById("nome").value;var numero=document.getElementById("numero").value;var email=document.getElementById("email").value;var horario=document.getElementById("horario").value;var isValid=!0;if(isValid){var link="mailto:belizarioclementino@hotmail.com"+"?subject=Reserva Palco SECTI"+"&body=Nome:  "+nome+"%0D%0A %0D%0A"+"Número:  "+numero+"%0D%0A %0D%0A"+"E-mail:   "+email+"%0D%0A %0D%0A"+"Horário:  "+horario+"%0D%0A %0D%0A"+"Motivo da Reserva: "+document.getElementById('msg').value;window.location.href=link;return!0}}const numeroInput=document.getElementById("numero");numeroInput.addEventListener("input",function(){const numero=numeroInput.value;const dddsValidos=["11","12","13","14","15","16","17","18","19","21","22","24","27","28","31","32","33","34","35","37","38","41","42","43","44","45","46","47","48","49","51","53","54","55","61","62","63","64","65","66","67","68","69","71","73","74","75","77","79","81","82","83","84","85","86","87","88","89","91","92","93","94","95","96","97","98","99",];const numeroSemMascara=numero.replace(/[\(\)\s\-]/g,"");if(dddsValidos.includes(numeroSemMascara.substring(0,2))){let numeroComMascara="("+numeroSemMascara.substring(0,2)+") ";if(numeroSemMascara.length===11){numeroComMascara+=numeroSemMascara.substring(2,7)+"-"+numeroSemMascara.substring(7)}else if(numeroSemMascara.length===10){numeroComMascara+=numeroSemMascara.substring(2,6)+"-"+numeroSemMascara.substring(6)}else{numeroComMascara+=numeroSemMascara.substring(2)}numeroInput.value=numeroComMascara}else{numeroInput.value=numeroInput.value.replace("-","")}});const inputs=document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], select');inputs.forEach((input)=>{input.addEventListener("focus",()=>{input.classList.add("input-focus")});input.addEventListener("blur",()=>{if(input.value===""){input.classList.remove("input-focus")}})});const toggleSwitch=document.querySelector(".toggle-checkbox");if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark-mode");document.body.classList.add("dark-mode");document.querySelector(".formulario1").classList.add("dark-mod");toggleSwitch.checked=!0}toggleSwitch.addEventListener("change",function(event){if(event.target.checked){document.documentElement.classList.add("dark-mode");document.body.classList.add("dark-mode");document.querySelector(".formulario1").classList.add("dark-mod");localStorage.setItem("theme","dark")}else{document.documentElement.classList.remove("dark-mode");document.body.classList.remove("dark-mode");document.querySelector(".formulario1").classList.remove("dark-mod");localStorage.setItem("theme","default")}})

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitForm(event, form);
  });

  const toggleButton = document.querySelector(".toggle-button");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      console.log("Toggle button clicked");
      // Your event handler code for the toggle button
    });
  }

  updateTimeSlotsAvailability();
});

let isSubmitting = false;
async function submitForm(event, form) {
  if (isSubmitting) return; // Se já estiver enviando, não faça nad
  isSubmitting = true;
  event.preventDefault();
  

  const formData = new FormData(form);
  const selectedTimeSlot = formData.get("horario");
  await db.collection("timeSlots").doc(selectedTimeSlot).set({ booked: true });

  const nome = formData.get("nome");
  const email = formData.get("email");
  const telefone = formData.get("numero"); // Atualizado para 'numero'
  const motivo = formData.get("msg"); // Atualizado para 'msg'

  await db.collection("formData").add({
    nome,
    email,
    telefone,
    horario: selectedTimeSlot,
    motivo,
  });

  form.reset();
  updateTimeSlotsAvailability();
  isSubmitting = false; // Reinicia o valor de isSubmitting ao final do processo
}

async function updateTimeSlotsAvailability() {
  const timeSlotSelect = document.getElementById("horario");

  // Fetch booked time slots from Firestore
  const snapshot = await db.collection("timeSlots").where("booked", "==", true).get();
  const bookedTimeSlots = snapshot.docs.map((doc) => doc.id);

  for (const option of timeSlotSelect.options) {
    if (bookedTimeSlots.includes(option.value)) {
      option.disabled = true;
    }
  }
}

