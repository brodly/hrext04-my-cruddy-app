Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}

var Item = function(name, category, description, note) {
  this.name = name;
  this.category = category;
  this.description = description;
  this.note = note;
}

var searchLocalStorage = function(term) {
  console.log(typeof term);
  for (var i of Object.keys(localStorage)) {
    if (i.replace(/\s+/g, '').toLowerCase() === term.replace(/\s+/g, '').toLowerCase()) {
      return i;
    } else {
      return false;
    }
  }
}


$(document).ready(function() {
  $("input.search-bar").on('keyup', function(event) {
    var $searchVal = $("input.search-bar").val();
    if (searchLocalStorage($searchVal) !== false) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });


  $("input.search-bar").on('keypress', function(event) {
    var key = event.which;
    var $searchVal = $("input.search-bar").val();
    if (key === 13) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });

  $(".add-text-btn").on("click", function(){
    // store values
    let inputKey = $(".user-input-title").val().replace(/\s+/g, '').toLowerCase();
    let inputDesc = $(".user-input-desc").val();
    let inputCategory = $("select").val();

    if (inputCategory === null) {
      inputCategory = 'unsorted';
    }

    // clear form values
    $(".user-input-title").val("");
    $(".user-input-desc").val("");

    console.log('key: value', inputKey, inputDesc, inputCategory);
    
    var item = new Item(inputKey, inputCategory, inputDesc);
    //localStorage.setItem(inputKey, inputDesc);
    localStorage.setObject(inputKey, item);
    // data-
    let itemHtml = `<div class="display-item" data-storage-key="${inputKey}">Added: ${inputKey}</div>`;
    $(".display").html(itemHtml);
    //console.log(localStorage);
    // how can we delegate this event to the outer html node?
    // https://learn.jquery.com/events/event-delegation/

    $(".display-item").on("click", function(e){
      // plop the key:value back into the input boxes

      // get the values from the the divs?
      console.log("key=> ", e.target.dataset.storageKey); // user-input-title
      var test = localStorage.getItem(e.target.dataset.storageKey); // user-input-desc
      console.log(JSON.parse(test));

      // set those values in the form fields
      $(".user-input-title").val(e.target.dataset.storageKey);
      $(".user-input-desc").val(localStorage.getItem(e.target.dataset.storageKey));
    });

  });

   // TODO add back in later
   // $(".user-input").on("keyup", function(){
   //   let inputDesc = $(".user-input").val();
   //   localStorage.setItem("testStorage", inputDesc);
   //   $(".display").text(localStorage.getItem("testStorage"));
   // });

   $(".del-text-btn").on("click", function() {
     alert('item deleted? check the console'); // maybe change to a window.confirm
     localStorage.removeItem( $('.user-input-title').val() ); // grab the title and plop here
     $(".user-input-title").val("");
     $(".user-input-desc").val("");

     // clearing display? what if I have multiple items?
     // after item is removed from local storage, redisplay items from local storage
     // refresh from storage?

   });

   // iterative approach to adding items
   // store data as stringified array of objects
   // store data with individual keys
  // how do we get keys? research Object.keys

  $(".add-category-item").on("click", function() {
    var category = prompt('New Category Name');
    if (category !== null) {
      if (category !== '') {
        category = category[0].toUpperCase() + category.slice(1);
        $(".content-row select").append(`<option value="${category.toLowerCase()}">${category}</option>`);
        $(".category-list").append(`<div class="category-item" id="${category.toLowerCase()}">${category}</div>`);
      } else {
        console.log('Category is NULL')
      }
    }
  });

  $(".category-item").on('mouseover', function(event){
    //console.log(event);
    // var $categoryName = $(`#${event.target.id}`);
    // $categoryName.css()
  });

  $(".category-list").on("mouseover", ".category-item, .add-category-item", function() {
    if (!$(this).hasClass('animated')) { 
      $(this).dequeue().stop().animate({ 
        fontSize: "1.15em"
      }, "300", "swing", function() {
        $(this).addClass('animated').animate({ 
          fontSize: "1em" 
        }, "500", "swing", function() {
          $(this).removeClass('animated').dequeue();
        });
      })
    }
  });
});