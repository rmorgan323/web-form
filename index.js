function validateInputs() {
  var age = validateAge();
  var rel = validateRel();
  return { age: age, rel: rel };
}

function validateRel() {
  if (document.querySelector('select[name="rel"]').value.length) {
    removeError('rel');
    return true;
  } else {
    return false;
  }
}

function validateAge() {
  var onlyNumbersRegex = /^[0-9]+$/;
  var spacesRegex = /\s/g;
  var userInput = document.querySelector('input[name="age"]').value.replace(spacesRegex, '');

  if (userInput === '') {
    removeError('age');
    return false;
  } else if (userInput.match(onlyNumbersRegex) 
      && userInput > 0 
      && userInput <= 120 
      || userInput === '') {
    removeError('age');
    return true;
  } else if (!userInput.match(onlyNumbersRegex)) {
    displayError('notANumber', 'age');
    return false;
  } else {
    displayError('outOfRange', 'age');
    return false;
  }
}

function submitForm() {
  var allMemberInfo = getMemberInfo();
  var serializedData = JSON.stringify(allMemberInfo);
  displaySerializedData(serializedData);
}

function addMember() {
  var inputs = validateInputs();

  if (inputs.age && inputs.rel) {
    var spacesRegex = /\s/g;
    var memAge = document.querySelector('input[name="age"]').value.replace(spacesRegex, '');
    var memRel = document.querySelector('select[name="rel"]').value;
    var memSmk = document.querySelector('input[name="smoker"]').checked;

    displayMember(memAge, memRel, memSmk);
    clearInputs();
    enableSubmit();
  } else {
    if (!inputs.age) displayError('required', 'age');
    if (!inputs.rel) displayError('required', 'rel');
  }
}

function clearInputs() {
  document.querySelector('input[name="age"]').value = '';
  document.querySelector('select[name="rel"]').selectedIndex = 0;
  document.querySelector('input[name="smoker"]').checked = false;
}

function enableSubmit() {
  document.querySelector('button[type="submit"]').disabled = false;
}

function disableSubmit() {
  document.querySelector('button[type="submit"]').disabled = true;
}

function removeError(loc) {
  var curr = document.querySelector('.' + loc + '-msg');
  if (curr) curr.remove();
}

function removeMember(id) {
  document.getElementById(id).closest('article').remove();
  if (!checkMembers()) disableSubmit();
}

function getMemberInfo() {
  var members = [].slice.call(document.querySelectorAll('.member-profile'));

  return members.reduce((accum, member, index) => {
    var memberData = member.children[0].dataset;
    accum[index] = {
      age: memberData.age,
      relationship: memberData.rel,
      smoker: memberData.smoker
    };
    return accum;
  }, {});
}

function checkMembers() {
  return document.querySelectorAll('.member-profile').length;
}

function displayMember(age, rel, smk) {
  var smokeStatus = smk ? 'Smoker' : 'Non-smoker';
  var memberId = Date.now();
  var newMem = document.createElement('article');

  newMem.classList.add('member-profile');
  newMem.innerHTML = (
    '<h4 data-age=' + age + ' data-rel=' + rel + ' data-smoker=' + smk + '>' + rel + '</h4>' +
    '<h4>Age: ' + age + '</h4>' + 
    '<h4>' + smokeStatus + '</h4>' + 
    '<button class="delete-member" id="member-' + memberId + '">delete member</button>'
  );

  document.querySelector('.builder').appendChild(newMem);
}

function displayError(type, loc) {
  var types = {
    notANumber: '* Please input a valid age',
    outOfRange: '* Age should be between 1 - 120',
    required: '* Required'
  };
  var locs = {
    age: { element: 'input', className: 'age-msg'},
    rel: { element: 'select', className: 'rel-msg'}
  };
  var curr = document.querySelector('.' + locs[loc].className);

  if (!curr) {
    var newErr = document.createElement('span');

    newErr.classList.add(locs[loc].className);
    newErr.setAttribute('style', "color:#e1687f");
    newErr.innerText = types[type];

    document.querySelector(locs[loc].element + '[name=' + loc + ']')
      .closest('div').appendChild(newErr);
  }
}

function displaySerializedData(jsonData) {
  var display = document.createElement('p');
  display.innerText = jsonData;
  document.querySelector('.debug').appendChild(display);
}

document.querySelector('input[name="age"]').addEventListener('keyup', validateAge, false);
document.querySelector('select[name="rel"]').addEventListener('change', validateRel, false);
document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
  event.preventDefault();
  submitForm();
}, false);
document.querySelector('.add').addEventListener('click', function(event) {
  event.preventDefault();
  addMember();
}, false);
document.querySelector('.builder').addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-member')) {
    event.preventDefault();
    removeMember(event.target.id);
  }
}, false);
document.addEventListener('DOMContentLoaded', function() {
  disableSubmit();
});