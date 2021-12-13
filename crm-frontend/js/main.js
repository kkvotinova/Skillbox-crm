'use strict';

(() => {
  const URL = 'http://localhost:3000/api/clients';
  const regExp = /(^[A-Z]{1}[a-z]{1,19}$)|(^[А-Я]{1}[а-я]{1,19}$)/;

  // * создаём тултип
  function addTooltip(clientsList) {
    for (let i = 0; i < clientsList.length; i++) {
      for (let j = 0; j < clientsList[i].contacts.length; j++) {
        let id = '#';
        switch (clientsList[i].contacts[j].type) {
          case 'Телефон':
            id += 'phone-' + i + j;
            break;
          case 'Email':
            id += 'mail-' + i + j;
            break;
          case 'Facebook':
            id += 'fb-' + i + j;
            break;
          case 'VK':
            id += 'vk-' + i + j;
            break;
          default:
            id += 'human-' + i + j;
            break;
        }

        tippy(id, {
          theme: 'tooltipTheme',
          content: `<strong>${clientsList[i].contacts[j].type}:</strong> ${clientsList[i].contacts[j].value}`,
          allowHTML: true,
        });
      }
    }
  }

  /*
    * добавление динамики модальным окнам
    * - input - ввод данных
    * - кнопка добавить клиента
  */
  function addDynamicsForModalWindow (key) {
    // * input - ввод данных
    const addDynamicsForInputs = (inputs, inputsLabel) => {
      inputs.forEach(input => {
        inputsLabel.forEach(label => {
          if (input.id == label.getAttribute('for')) {
            input.addEventListener('input', () => {
              label.classList.add('focus-label');
              if (!input.value) {
                label.classList.remove('focus-label');
              }
            });
          }
        });
      });
    };
    // * кнопка - добавить контакт
    const addDynamicsForBtn = className => {
      const modalAddContact = document.querySelector(className.first);
      let counterOfAddedContacts = 0;
      modalAddContact.addEventListener('click', () => {
        modalAddContact.style = 'margin-bottom: 25px';
        if (counterOfAddedContacts < 10) {
          const modalAddForm = document.querySelector(className.second);
          modalAddForm.style = 'margin-top: 25px';
          const addFormInput = document.createElement('div');
          addFormInput.classList.add('add__form_input');

          const select = document.createElement('select');
          select.classList.add('select');

          const listOptionsItem = ['Телефон', 'Другое', 'Email', 'VK', 'Facebook'];
          const listOptionsValues = ['phone', 'other', 'email', 'vk', 'facebook'];
          for (let i = 0; i < listOptionsItem.length; i++) {
            const option = document.createElement('option');
            option.classList.add('option');
            if (!i) option.setAttribute('selected', true);
            option.setAttribute('value', listOptionsValues[i]);
            option.textContent = listOptionsItem[i];
            select.append(option);
          }

          const input = document.createElement('input');
          input.classList.add('select__input');
          input.setAttribute('type', 'text');
          input.setAttribute('placeholder', 'Введите данные контакта');

          const button = document.createElement('button');
          button.classList.add('select__input_btn');
          button.setAttribute('type', 'button');
          button.id = 'select-input-delete';
          button.style = 'display: none';

          input.addEventListener('input', () => {
            input.classList.add('edit');
            button.style = 'display: block';
          });

          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.classList.add('select__input_btn_pic');
          svg.setAttribute("viewBox", "0 0 12 12");
          svg.setAttribute("width", 12);
          svg.setAttribute("height", 12);
          svg.setAttribute("fill", "none");

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", "M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z");
          path.setAttribute("fill", "#B0B0B0");

          svg.append(path);
          button.append(svg);

          button.addEventListener('click', () => {
            addFormInput.remove();
            --counterOfAddedContacts;
            if (counterOfAddedContacts == 9) {
              modalAddContact.style = 'display: block';
              modalAddContact.style = 'margin-bottom: 25px';
            }
            if (!counterOfAddedContacts) {
              modalAddContact.style = 'margin-bottom: 0px';
              modalAddForm.style = 'margin-top: 0px';
            }
          });

          addFormInput.append(select);
          addFormInput.append(input);
          addFormInput.append(button);
          modalAddForm.append(addFormInput);

          $('.add__form_input select').selectpicker();
          tippy('#select-input-delete', {
            theme: 'tooltipTheme',
            content: "<strong>Удалить контакт</strong>",
            allowHTML: true,
          });

          ++counterOfAddedContacts;
        }
        if (counterOfAddedContacts === 10) {
          modalAddContact.style = 'display: none';
        }
      });
    };

    switch (key) {
      case 1:
        // input [modal change]
        const inputs1 = document.querySelectorAll('.change-input');
        const inputsLabel1 = document.querySelectorAll('.change-input-label');
        addDynamicsForInputs(inputs1, inputsLabel1);
        break;
      case 2:
        // input [modal add]
        const inputs2 = document.querySelectorAll('.add-input');
        const inputsLabel2 = document.querySelectorAll('.add-input-label');
        addDynamicsForInputs(inputs2, inputsLabel2);
        break;
      case 3:
        // btn [modal change]
        addDynamicsForBtn({
          first: '.footer__btn_change',
          second: '.modal__change_add_form',
        });
        break;
      case 4:
        // btn [modal add]
        addDynamicsForBtn({
          first: '.footer__btn_add',
          second: '.modal__add_form',
        });
        break;
      default:
        break;
    }
  }

  // * подгружаем с сервера список существующих клиентов
  async function getListOfClients(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error message:', error.message);
    }
  }

  // * Рисуем таблицу
  function drawingTableOfClients(clientsList) {
    const mainBtnAdd = document.querySelector('.main__btn_container');
    let marginTop = 340;

    // цикл по всем клиентам
    for (let i = 0; i < clientsList.length; i++) {
      const spinner = document.querySelector('.spinner-border');
      spinner.style = 'display: none';
      // создаём строку таблицы
      const tbodyTr = document.createElement('tr');
      tbodyTr.classList.add('table__tbody_tr');

      // поочередно добавляем все данные клиента
      for (let key = 0; key < 6; key++) {
        const tbodyTd = document.createElement('td');
        tbodyTd.classList.add('table__tbody_td');
        switch (key) {
          case 0:
            tbodyTd.classList.add('tbody_id', 'td_text');
            tbodyTd.textContent = Math.trunc(clientsList[i].id / 10000000);
            break;
          case 1:
            tbodyTd.classList.add('td_full-name');
            tbodyTd.textContent = clientsList[i].surname + ' ' + clientsList[i].name;
            if (clientsList[i].lastName) {
              tbodyTd.textContent += ' ' + clientsList[i].lastName;
            }
            break;
          case 2:
            tbodyTd.classList.add('td_create');
            const date = new Date(clientsList[i].createdAt);
            tbodyTd.textContent = '';
            if (date.getDate() < 10) {
              tbodyTd.textContent = '0';
            }
            tbodyTd.textContent += `${date.getDate()}.`;
            if (date.getMonth() < 9) {
              tbodyTd.textContent += '0';
            }
            tbodyTd.textContent += `${date.getMonth() + 1}.${date.getFullYear()} `;

            const span = document.createElement('span');
            span.classList.add('td_text');
            span.textContent = `${date.getHours()}:${date.getMinutes()}`;
            tbodyTd.append(span);
            break;
          case 3:
            tbodyTd.classList.add('td_change');
            const date2 = new Date(clientsList[i].updatedAt);
            tbodyTd.textContent = '';
            if (date2.getDate() < 10) {
              tbodyTd.textContent = '0';
            }
            tbodyTd.textContent += `${date2.getDate()}.`;
            if (date2.getMonth() < 9) {
              tbodyTd.textContent += '0';
            }
            tbodyTd.textContent += `${date2.getMonth() + 1}.${date2.getFullYear()} `;

            const span2 = document.createElement('span');
            span2.classList.add('td_text');
            span2.textContent = `${date2.getHours()}:${date2.getMinutes()}`;
            tbodyTd.append(span2);
            break;
          case 4:
            for (let j = 0; j < clientsList[i].contacts.length; j++) {
              const img = document.createElement('img');
              img.classList.add('tbody__td_pic');
              img.alt = 'icon'
              switch (clientsList[i].contacts[j].type) {
                case 'Телефон':
                  img.id = 'phone-' + i + j;
                  img.src = 'img/svg/phone.svg';
                  break;
                case 'Email':
                  img.id = 'mail-' + i + j;
                  img.src = 'img/svg/mail.svg';
                  break;
                case 'Facebook':
                  img.id = 'fb-' + i + j;
                  img.src = 'img/svg/fb.svg';
                  break;
                case 'VK':
                  img.id = 'vk-' + i + j;
                  img.src = 'img/svg/vk.svg';
                  break;
                default:
                  img.id = 'human-' + i + j;
                  img.src = 'img/svg/human.svg';
                  break;
              }
              // костыли
              if (j < 5 && clientsList[i].contacts.length >= 5) {
                img.classList.add('top-pic');
                if (j === 4) {
                  img.classList.add('end-pic');
                }
              }
              if (j === 4 && !img.classList.contains('last-pic')) {
                img.classList.add('last-pic');
              }
              tbodyTd.append(img);
            }
            break;
          case 5:
            // кнопка изменить
            const btnChange = document.createElement('button');
            btnChange.classList.add('tbody_td_btn', 'btn-change');
              // span - spinner
            const btnSpinnerChange = document.createElement('span');
            btnSpinnerChange.classList.add('spinner-border', 'spinner-border-sm');
            btnSpinnerChange.setAttribute('role', 'status');
            btnSpinnerChange.setAttribute('aria-hidden', 'true');
            btnChange.append(btnSpinnerChange);
            btnChange.append('Изменить');
            btnChange.addEventListener('click', () => {
              const modal = new bootstrap.Modal(document.querySelector('#changeModal'));
              btnChange.classList.add('btn-add-spinner');
              btnSpinnerChange.style = 'display: inline-block';
              setTimeout(() => {
                modal.show();
                btnChange.classList.remove('btn-add-spinner');
                btnSpinnerChange.style = 'display: none';
              }, 1000);

              // крестик
              const btnClose = document.querySelector('.header__change_btn ');
              btnClose.addEventListener('click', () => modal.hide());

              const clientId = document.querySelector('.header__change_title_id');
              clientId.textContent = `ID: ${Math.trunc(clientsList[i].id / 10000000)}`;
              const btnDeleteModal = document.querySelector('.footer__btn_cancel_change');
              btnDeleteModal.style = 'opacity: 0';
              // изменить клиента
              const btnChangeModal = document.querySelector('.footer__btn_save_change');
              btnChangeModal.addEventListener('click', async (e) => {
                // чтобы страница не перезагружалась при отправке формы
                e.preventDefault();

                const spinner = document.querySelector('.spinner-change');
                spinner.style.display = 'inline-block';
                btnChangeModal.classList.add('add-spinner');

                const sername = document.getElementById('input-sername-2');
                const name = document.getElementById('input-name-2');
                const lastname = document.getElementById('input-lastname-2');

                let isChecked = false;
                if (sername.value.trim() == '' || sername.value.trim().replace(regExp, '') != '') {
                  sername.classList.add('input-error');
                  isChecked = true;
                }
                if (name.value.trim() == '' || name.value.trim().replace(regExp, '') != '') {
                  name.classList.add('input-error');
                  isChecked = true;
                }
                if (lastname.value.trim().replace(regExp, '') != '') {
                  lastname.classList.add('input-error');
                  isChecked = true;
                }
                if (isChecked) return;

                // создаём список контактов Object({type: , value: })
                const listTypes = document.querySelectorAll('.filter-option-inner-inner');
                const listValues = document.querySelectorAll('.select__input');
                let contacts = [];
                for (let i = 0; i < listTypes.length; i++) {
                  if (!listValues[i].value) continue;
                  contacts.push({
                    type: listTypes[i].textContent,
                    value: listValues[i].value.trim()
                  });
                }

                await fetch(`${URL}/${clientsList[i].id}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    name: name.value.trim(),
                    surname: sername.value,
                    lastName: lastname.value.trim(),
                    contacts: contacts
                  }
                  ),
                  headers: { 'Content-Type': 'application/json' },
                });

                // Приводим в начальное состояние (очищаем)
                clearModal(2);
                addDynamicsForModalWindow(3);
              });
              // удалить клиента
              let timeoutID;
              const dispalyBtn = () => {
                clearTimeout(timeoutID);
                timeoutID = setTimeout(() => {
                  if (clientsList[i].name == name.value && clientsList[i].surname == surname.value) {
                    btnDeleteModal.style = 'opacity: 1';
                  }
                }, 300);
              };
              const surname = document.getElementById('input-sername-2');
              const name = document.getElementById('input-name-2');
              surname.addEventListener('input', dispalyBtn);
              name.addEventListener('input', dispalyBtn);

              btnDeleteModal.addEventListener('click', async () => {
                tbodyTr.remove();
                await fetch(`${URL}/${clientsList[i].id}`, {
                  method: 'DELETE',
                });
              });
            });

            // кнопка удалить
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('tbody_td_btn', 'btn-delete');
              // spinner
            const btnSpinnerDelete = document.createElement('span');
            btnSpinnerDelete.classList.add('spinner-border', 'spinner-border-sm', 'red');
            btnSpinnerDelete.setAttribute('role', 'status');
            btnSpinnerDelete.setAttribute('aria-hidden', 'true');
            btnDelete.append(btnSpinnerDelete);
            btnDelete.append('Удалить');
            btnDelete.addEventListener('click', () => {
              const modal = new bootstrap.Modal(document.querySelector('#deleteModal'));
              btnDelete.classList.add('btn-add-spinner');
              btnSpinnerDelete.style = 'display: inline-block';
              setTimeout(() => {
                modal.show();
                btnDelete.classList.remove('btn-add-spinner');
                btnSpinnerDelete.style = 'display: none';
              }, 1000);

              // крестик
              const btnClose = document.querySelector('.header__delete_btn ');
              btnClose.addEventListener('click', () => modal.hide());
              // отмена
              const btnCancel = document.querySelector('.btn_modal-cancel');
              btnCancel.addEventListener('click', () => modal.hide());

              // удалить клиента
              const btnDeleteModal = document.querySelector('.btn_modal-delete');
              btnDeleteModal.addEventListener('click', async () => {
                tbodyTr.remove();
                await fetch(`${URL}/${clientsList[i].id}`, {
                  method: 'DELETE',
                });
              });
            });

            tbodyTd.append(btnChange);
            tbodyTd.append(btnDelete);
            break;
          default:
            break;
        }
        tbodyTr.append(tbodyTd);
      }

      // добавляем строку в таблицу
      const tableTbody = document.querySelector('.main__table_tbody');
      tableTbody.append(tbodyTr);

      // костыль
      if (i < 5) {
        marginTop -= 60;
        mainBtnAdd.style = `margin-top: ${marginTop}px`;
      }
    }

    addTooltip(clientsList);
  }

  // * очищаем модальное окно
  function clearModal(key) {
    let listClassNames;
    if (key == 1) {
      // [add]
      listClassNames = {
        first: 'add-input',
        second: 'footer__btn_add',
        third: 'modal__add_form',
        fourth: 'modal__add_main-btn',
      };
    } else if (key == 2){
      // [change]
      listClassNames = {
        first: 'change-input',
        second: 'footer__btn_change',
        third: 'modal__change_add_form',
        fourth: 'modal__change_main-btn',
      };
    }

    let inputs = document.querySelectorAll(`.${listClassNames.first}`);
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('input-error');
    });
    inputs = document.querySelector(`.${listClassNames.second}`);
    inputs.remove();
    inputs = document.querySelector(`.${listClassNames.third}`);
    inputs.remove();

    const form = document.createElement('div');
    form.classList.add(listClassNames.third);

    const btnAdd = document.createElement('button');
    btnAdd.classList.add(listClassNames.second);
    btnAdd.type = 'button';
    btnAdd.textContent = 'Добавить контакт';

    const mainBtn = document.querySelector(`.${listClassNames.fourth}`);
    mainBtn.append(form);
    mainBtn.append(btnAdd);
  }

  // * очищаем таблицу
  function clearTable() {
    let tbody = document.querySelector('.main__table_tbody');
    tbody.remove();
    tbody = document.createElement('tbody');
    tbody.classList.add('main__table_tbody');
    const table = document.querySelector('.main__table');
    table.append(tbody);
  }

  // * сортировка таблицы
  function sortTable(id, typeSort, clientsList) {
    let sortArray = [];
    let sortedClientsList = [];
    switch (id) {
      case 0:
        clientsList.forEach(client => sortArray.push(client.id));
        typeSort ? sortArray.sort() : sortArray.sort((a, b) => b - a);
        for (let i = 0; i < clientsList.length; i++) {
          clientsList.forEach(client => {
            if (client.id === sortArray[i]) {
              sortedClientsList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientsList);
        break;
      case 1:
        clientsList.forEach(client => sortArray.push(client.surname +  client.name + client.lastName));
        typeSort ? sortArray.sort() : sortArray.sort().reverse();
        for (let i = 0; i < clientsList.length; i++) {
          clientsList.forEach(client => {
            if (sortArray[i].includes(client.surname) && sortArray[i].includes(client.name) && sortArray[i].includes(client.lastName)) {
              sortedClientsList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientsList);
        break;
      case 2:
        clientsList.forEach(client => sortArray.push(new Date(client.createdAt)));
        typeSort ? sortArray.sort((a, b) => a.getTime() - b.getTime()) : sortArray.sort((a, b) => b.getTime() - a.getTime());
        for (let i = 0; i < clientsList.length; i++) {
          clientsList.forEach(client => {
            if (new Date(client.createdAt).getTime() === sortArray[i].getTime()) {
              sortedClientsList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientsList);
        break;
      case 3:
        clientsList.forEach(client => sortArray.push(new Date(client.updatedAt)));
        typeSort ? sortArray.sort((a, b) => a.getTime() - b.getTime()) : sortArray.sort((a, b) => b.getTime() - a.getTime());
        for (let i = 0; i < clientsList.length; i++) {
          clientsList.forEach(client => {
            if (new Date(client.updatedAt).getTime() === sortArray[i].getTime()) {
              sortedClientsList.push(client);
            }
          });
        }
        clearTable();
        drawingTableOfClients(sortedClientsList);
        break;
      default:
        break;
    }
  }

  // * main function
  window.addEventListener('DOMContentLoaded', async () => {
    for (let i = 1; i < 5; i++) {
      addDynamicsForModalWindow(i);
    }

    const URLParams = new URLSearchParams(window.location.search);
    const searchParam = URLParams.get('search');
    const clientsList = (!searchParam) ? await getListOfClients(URL) : await getListOfClients(`${URL}?search=${searchParam}`);
    setTimeout(drawingTableOfClients(clientsList), 2000);

    // * модальное окно [Добавить клиента]
    // ** кнопка отмена
    const btnCancelAdd = document.querySelector('.footer__btn_cancel_add');
    btnCancelAdd.addEventListener('click', () => {
      clearModal(1);
      addDynamicsForModalWindow(4);
    });
    // ** кнопка сохранить
    const btnSaveAdd = document.querySelector('.footer__btn_save_add');
    btnSaveAdd.form.addEventListener('submit', async (e) => {
      // чтобы страница не перезагружалась при отправке формы
      e.preventDefault();

      const sername = document.getElementById('input-sername-1');
      const name = document.getElementById('input-name-1');
      const lastname = document.getElementById('input-lastname-1');

      let isChecked = false;
      if (sername.value.trim() == '' || sername.value.trim().replace(regExp, '') != '') {
        sername.classList.add('input-error');
        isChecked = true;
      }
      if (name.value.trim() == '' || name.value.trim().replace(regExp, '') != '') {
        name.classList.add('input-error');
        isChecked = true;
      }
      if (lastname.value.trim().replace(regExp, '') != '') {
        lastname.classList.add('input-error');
        isChecked = true;
      }
      if (isChecked) return;

      // создаём список контактов Object({type: , value: })
      const listTypes = document.querySelectorAll('.filter-option-inner-inner');
      const listValues = document.querySelectorAll('.select__input');
      let contacts = [];
      for (let i = 0; i < listTypes.length; i++) {
        if (!listValues[i].value) continue;
        contacts.push({
          type: listTypes[i].textContent,
          value: listValues[i].value.trim()
        });
      }

      const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
          name: name.value.trim(),
          surname: sername.value,
          lastName: lastname.value.trim(),
          contacts: contacts
        }
        ),
        headers: { 'Content-Type': 'application/json' },
      });

      // Приводим в начальное состояние (очищаем)
      clearModal(1);
      addDynamicsForModalWindow(4);
    });

    // * поиск
    let timeoutID;
    const inputSearch = document.querySelector('.header__input_text');
    inputSearch.addEventListener('input', () => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(async () => {
        document.location.assign(`?search=${inputSearch.value}`);
      }, 300);
    })

    // * сортировка
    const theadTd = document.querySelectorAll('.table__thead_td');
    let typeSort = [true, false, false, false];
    for (let i = 0; i < 4; i++) {
      theadTd[i].addEventListener('click', async () => {
        const classNames = [{first: 'active-up', second: 'active-up-full'},
                          {first: 'active-down', second: 'active-down-full'}];
        // удаляем active класс прошлой кнопки
        for (let j = 0; j < 4; j++) {
          if (j === 1) {
            if (theadTd[j].classList.contains(classNames[0].second)) {
              theadTd[j].classList.remove(classNames[0].second);
            }
            if (theadTd[j].classList.contains(classNames[1].second)) {
              theadTd[j].classList.remove(classNames[1].second);
            }
          } else {
            if (theadTd[j].classList.contains(classNames[0].first)) {
              theadTd[j].classList.remove(classNames[0].first);
            }
            if (theadTd[j].classList.contains(classNames[1].first)) {
              theadTd[j].classList.remove(classNames[1].first);
            }
          }
        }
        // добавляем active класс текущей кнопке
        if (i === 1) {
          if (typeSort[i]) {
            theadTd[i].classList.add(classNames[1].second);
            typeSort[i] = false;
          } else {
            theadTd[i].classList.add(classNames[0].second);
            typeSort[i] = true;
          }
        } else {
          if (typeSort[i]) {
            theadTd[i].classList.add(classNames[1].first);
            typeSort[i] = false;
          } else {
            theadTd[i].classList.add(classNames[0].first);
            typeSort[i] = true;
          }
        }
        const clientsList = (!searchParam) ? await getListOfClients(URL) : await getListOfClients(`${URL}?search=${searchParam}`);
        sortTable(i, typeSort[i], clientsList);
      })
    }
  });
})();
