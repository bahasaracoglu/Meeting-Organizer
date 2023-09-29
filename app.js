// JavaScript to manage input values
document.addEventListener("DOMContentLoaded", function () {
  let allMeetings = [];
  let events = [];
  console.log(events);
  let event = {};
  function getMeetings() {
    let url = "http://127.0.0.1:5000/meetings";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        allMeetings = data;
        data.forEach(function (item) {
          var startDateTime = item.date + "T" + item.start_time + ":00";
          var endDateTime = item.date + "T" + item.end_time + ":00";

          event = {
            title: item.topic,
            start: startDateTime,
            end: endDateTime,
          };
          events.push(event);
        });
      })
      .catch((error) => {
        console.error("Bir hata oluştu:", error);
      });
  }
  getMeetings();

  const createMeetingBtn = document.getElementById("create-meeting");

  createMeetingBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const editedTopic = document.getElementById("createTopic").value;

    const editedParticipants =
      document.getElementById("create-email-input").value;

    const editedDate = document.getElementById("create-date").value;
    const editedStart = document.getElementById("create-start").value;
    const editedEnd = document.getElementById("create-end").value;
    console.log("create-tıklandı");

    // POST isteği göndererek yeni toplantı
    fetch(`http://127.0.0.1:5000/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: editedTopic,
        participants: editedParticipants,
        date: editedDate,
        start_time: editedStart,
        end_time: editedEnd,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        getMeetings();
        // Düzenleme formunu kapat
        const successMessage = document.getElementById("success-message");
        successMessage.style.display = "block"; // Bildirim mesajını görünür yap
        setTimeout(() => {
          successMessage.style.display = "none"; // 5 saniye sonra bildirim mesajını gizle
        }, 5000);

        const myModal = document.getElementById("close-meeting");
        setTimeout(function () {
          myModal.click();
          updateList();
        }, 500);
      })
      .catch((error) => {
        console.error("Bir hata oluştu:", error);
      });
  });

  const updateMeetingBtn = document.getElementById("edit-btn");
  const updateMeetingForm = document.getElementById("update-plan");

  if (updateMeetingBtn)
    updateMeetingBtn.addEventListener("click", function () {
      updateMeetingForm.style.display = "block"; // Formu göster
    });

  // Toplantıları listele butonuna tıklanınca listeyi göster
  const listMeetingsBtn = document.getElementById("list-meetings-btn");
  const meetingList = document.getElementById("meeting-list");
  const meetingsUl = document.getElementById("meetings-list-cont");

  function updateList() {
    getMeetings();
    meetingsUl.innerHTML = ""; // Önceki içeriği temizleyin
    const table = document.createElement("table");
    table.className = "table meeting-list";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Tablo başlıkları
    const tableHeaders = [
      "Konu",
      "Tarih",
      "Katılımcılar",
      "Başlangıç Saati",
      "Bitiş Saati",
      "Düzenle",
      "Sil",
    ];

    // Başlık sırasını oluştur
    const headerRow = document.createElement("tr");
    tableHeaders.forEach((headerText) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Toplantıları tabloya ekle
    allMeetings.forEach(function (meeting) {
      const meetingRow = document.createElement("tr");

      const topicCell = document.createElement("td");
      topicCell.textContent = meeting.topic;

      const dateCell = document.createElement("td");
      dateCell.textContent = meeting.date;

      const participantsCell = document.createElement("td");
      participantsCell.textContent = meeting.participants;

      const startTimeCell = document.createElement("td");
      startTimeCell.textContent = meeting.start_time;

      const endTimeCell = document.createElement("td");
      endTimeCell.textContent = meeting.end_time;

      // Düzenleme (edit) düğmesi
      const editButtonCell = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.className = "btn btn-primary btn-sm";
      editButton.id = "edit-btn";
      editButton.setAttribute("data-bs-toggle", "modal");
      editButton.setAttribute("data-bs-target", "#editModal");
      editButton.setAttribute("data-meeting-id", meeting.id);
      editButton.textContent = "Düzenle";
      editButton.addEventListener("click", function () {
        // Düzenleme işlemi burada yapılır

        const meetingId = editButton.getAttribute("data-meeting-id");
        console.log(meetingId);
        console.log(allMeetings);
        const selectedMeeting = allMeetings.find(
          (meeting) => meeting.id == meetingId
        );
        console.log(selectedMeeting);
        document.getElementById("editTopic").value = selectedMeeting.topic;
        document.getElementById("email-input").value =
          selectedMeeting.participants;
        document.getElementById("date").value = selectedMeeting.date;
        document.getElementById("start").value = selectedMeeting.start_time;
        document.getElementById("end").value = selectedMeeting.end_time;

        // Düzenleme formunu göster
      });
      editButtonCell.appendChild(editButton);

      // Silme (delete) düğmesi
      const deleteButtonCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.textContent = "Sil";
      deleteButton.addEventListener("click", function (event) {
        const meetingId = meeting.id;
        console.log("meeting id", meetingId);
        fetch(`http://127.0.0.1:5000/meetings/${meetingId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("HTTP error " + response.status);
            }
            return response.json();
          })
          .then((data) => {
            getMeetings();
            setTimeout(function () {
              updateList();
            }, 500);

            // Silme işlemi tamamlandı
          })
          .catch((error) => {
            console.error("Bir hata oluştu:", error);
          });

        // Silme işlemi burada yapılır
        console.log("Sil düğmesine tıklandı: " + meeting.id);
      });
      deleteButtonCell.appendChild(deleteButton);

      meetingRow.appendChild(topicCell);
      meetingRow.appendChild(dateCell);
      meetingRow.appendChild(participantsCell);
      meetingRow.appendChild(startTimeCell);
      meetingRow.appendChild(endTimeCell);
      meetingRow.appendChild(editButtonCell);
      meetingRow.appendChild(deleteButtonCell);

      tbody.appendChild(meetingRow);
    });

    table.appendChild(tbody);
    meetingsUl.appendChild(table);
    // Listeyi göster

    meetingList.style.display === "block";

    const sendUpdateBtn = document.getElementById("send-updateBtn");

    // "Düzenle" düğmesine tıklandığında

    // "Düzenlemeyi Tamamla" düğmesine tıklandığında
    sendUpdateBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const meetingId = document
        .getElementById("edit-btn")
        .getAttribute("data-meeting-id");
      const editedTopic = document.getElementById("editTopic").value;
      const editedParticipants = document.getElementById("email-input").value;
      const editedDate = document.getElementById("date").value;
      const editedStart = document.getElementById("start").value;
      const editedEnd = document.getElementById("end").value;
      console.log("tıklandı");
      // Diğer toplantı bilgilerini de alın

      // PUT isteği göndererek toplantıyı güncelleyin
      fetch(`http://127.0.0.1:5000/meetings/${meetingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: editedTopic,
          participants: editedParticipants,
          date: editedDate,
          start_time: editedStart,
          end_time: editedEnd,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          getMeetings();
          // Düzenleme formunu kapat
          const myModal = document.getElementById("close-meeting-up");
          setTimeout(function () {
            myModal.click();
            updateList();
          }, 500);
        })
        .catch((error) => {
          console.error("Bir hata oluştu:", error);
        });
    });
  }

  listMeetingsBtn.addEventListener("click", function () {
    // Bu kısımda meetings verilerini kullanarak toplantıları listeleyebilirsiniz
    // Örnek olarak, meetings verisi aşağıdaki gibidir:
    updateList();
    // Toplantıları listeleyin
    if (
      meetingsUl.style.display === "none" ||
      meetingsUl.style.display === ""
    ) {
      meetingsUl.style.display = "block"; // Görünmezse veya boşsa görünür yap
    } else {
      meetingsUl.style.display = "none"; // Görünüyorsa gizle
    }
  });

  // const emailInput = document.getElementById("email-input");
  // const addEmailButton = document.getElementById("add-email-button");
  // const emailTags = document.getElementById("email-tags");

  // Function to remove a tag when its delete button is clicked
  // function removeTag(tag) {
  //   tag.remove();
  // }

  // addEmailButton.addEventListener("click", function () {
  //   const email = emailInput.value.trim();

  //   if (email) {
  //     // Create a tag-like element to display the email
  //     const tag = document.createElement("span");
  //     tag.className = "badge rounded-pill text-bg-light p-2";
  //     tag.textContent = email;

  //     // Create a delete button for the tag
  //     const deleteButton = document.createElement("button");
  //     deleteButton.className = "btn-close";
  //     deleteButton.addEventListener("click", function () {
  //       removeTag(tag);
  //     });

  //     // Append the delete button to the tag
  //     tag.appendChild(deleteButton);

  //     // Append the tag to the email tags container
  //     emailTags.appendChild(tag);

  //     // Clear the input field
  //     emailInput.value = "";
  //   }
  // });

  // var calendarEl = document.getElementById("calendar");
  // const showCalendarBt = document.getElementById("show-calendar-btn");

  // showCalendarBt.addEventListener("click", function () {
  //   const calendarStyle = calendarEl.style;

  //   if (calendarStyle.display === "" || calendarStyle.display === "block") {
  //     calendarStyle.display = "none"; // Görünüyorsa gizle
  //   } else {
  //     calendarStyle.display = "block"; // Görünmezse görünür yap
  //   }
  // });

  // var calendar = new FullCalendar.Calendar(calendarEl, {
  //   initialView: "dayGridMonth",
  //   events: events,
  //   eventClick: function (info) {
  //     var event = info.event;
  //     var card = document.createElement("div");
  //     card.className = "card custom-card";
  //     card.innerHTML = `
  //                             <div class="card-body">
  //                                 <h5 class="card-title">${event.title}</h5>
  //                                 <p class="card-text">Başlangıç: ${event.start.toLocaleString()}</p>
  //                                 <p class="card-text">Bitiş: ${event.end.toLocaleString()}</p>
  //                             </div>
  //                         `;

  //     var container = document.getElementById("card-container");
  //     container.innerHTML = "";
  //     container.appendChild(card);
  //   },
  // });

  // calendar.render();
});
