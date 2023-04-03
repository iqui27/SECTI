const toggleButton = document.querySelector('.toggle-button');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark')
});

const numeroInput = document.getElementById("numero");
numeroInput.addEventListener("input", function () {
    const numero = numeroInput.value;
    const dddsValidos = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "99", ];
    const numeroSemMascara = numero.replace(/[\(\)\s\-]/g, "");
    if (dddsValidos.includes(numeroSemMascara.substring(0, 2))) {
        let numeroComMascara = "(" + numeroSemMascara.substring(0, 2) + ") ";
        if (numeroSemMascara.length === 11) {
            numeroComMascara += numeroSemMascara.substring(2, 7) + "-" + numeroSemMascara.substring(7)
        } else if (numeroSemMascara.length === 10) {
            numeroComMascara += numeroSemMascara.substring(2, 6) + "-" + numeroSemMascara.substring(6)
        } else {
            numeroComMascara += numeroSemMascara.substring(2)
        }
        numeroInput.value = numeroComMascara
    } else {
        numeroInput.value = numeroInput.value.replace("-", "")
    }
});
const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], select');
inputs.forEach((input) => {
    input.addEventListener("focus", () => {
        input.classList.add("input-focus")
    });
    input.addEventListener("blur", () => {
        if (input.value === "") {
            input.classList.remove("input-focus")
        }
    })
});
const toggleSwitch = document.querySelector(".toggle-checkbox");
if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
    document.querySelector(".form")
        .classList.add("dark-mod");
    toggleSwitch.checked = !0
}
toggleSwitch.addEventListener("change", function (event) {
    if (event.target.checked) {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
        document.querySelector(".form")
            .classList.add("dark-mod");
        localStorage.setItem("theme", "dark")
    } else {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
        document.querySelector(".form")
            .classList.remove("dark-mod");
        localStorage.setItem("theme", "default")
    }
})


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
  document.getElementById("dia").addEventListener("change", updateTimeSlotsAvailability);
});

let isSubmitting = false;
async function submitForm(event, form) {
  if (isSubmitting) return; // Se já estiver enviando, não faça nad
  isSubmitting = true;
  event.preventDefault();
  

  const formData = new FormData(form);
  const dia = formData.get("dia"); // Adicione esta linha para obter o dia selecionado
  // ...
  const selectedDay = formData.get("dia"); // Adicione esta linha
  const selectedTimeSlot = `${selectedDay}-${formData.get("horario")}`; // Modifique esta linha para incluir o dia
  await db.collection("timeSlots").doc(selectedTimeSlot).set({ booked: true });

  const nome = formData.get("nome");
  const email = formData.get("email");
  const telefone = formData.get("numero"); // Atualizado para 'numero'
  const motivo = formData.get("msg"); // Atualizado para 'msg'

  await db.collection("formData").add({
    nome,
    email,
    telefone,
    dia, // Adicione esta linha para incluir o dia selecionado ao enviar os dados
    horario: selectedTimeSlot,
    motivo,
  });
  
  // redireciona para a página end.html
  redirectToEndPage();
  
  function redirectToEndPage() {
    window.location.href = "end.html";
  }
  form.reset();
  updateTimeSlotsAvailability();
  isSubmitting = false; // Reinicia o valor de isSubmitting ao final do processo
}

async function updateTimeSlotsAvailability() {
  const daySelect = document.getElementById("dia");
  const timeSlotSelect = document.getElementById("horario");

  const loadTimeSlots = async () => {
    const selectedDay = daySelect.value;

    // Fetch booked time slots from Firestore
    const snapshot = await db.collection("timeSlots").get();
    const bookedTimeSlots = snapshot.docs
      .filter((doc) => doc.data().booked)
      .map((doc) => doc.id);

    for (const option of timeSlotSelect.options) {
      if (bookedTimeSlots.includes(`${selectedDay}-${option.value}`)) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    }
  };

  // Add a listener for when the day is changed
  daySelect.addEventListener("change", loadTimeSlots);

  // Load the available time slots when the page is loaded
  loadTimeSlots();
}
