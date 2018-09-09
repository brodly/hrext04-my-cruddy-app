Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}

var categoryList = []

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

  /* 
  Search bar functionality
  Both on individual keypress (realtime search) and on enter
  */

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


  /*
  Add Item Button
  Adds Item in localStorage as an object.
  */

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

    console.log('Item Stored in localStorage: ', inputKey, inputDesc, inputCategory);
    
    var item = new Item(inputKey, inputCategory, inputDesc);
    //localStorage.setItem(inputKey, inputDesc);
    localStorage.setObject(inputKey, item);


    // Confirmation of Item Added to List
    let itemHtml = `<div class="display-item" data-storage-key="${inputKey}">Added: ${inputKey}</div>`;
    $(".display").html(itemHtml);
    
    // how can we delegate this event to the outer html node?
    // https://learn.jquery.com/events/event-delegation/



    /*
    Do we still want this functionality? Possible hover over/click brings up options
    including delete, but also edit.

    NOTE: Item display now moved into particular category
    */
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


  /*
  REMOVED: Delete Button

  $(".del-text-btn").on("click", function() {
    alert('item deleted? check the console'); // maybe change to a window.confirm
    localStorage.removeItem( $('.user-input-title').val() ); // grab the title and plop here
    $(".user-input-title").val("");
    $(".user-input-desc").val("");
  });
  */


  /*
  Add Category Button Functionality
  Prompts users to create a new catgeory and appends it to the end of the category list 
  */
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


  /*
  Category Button Functianality
  Clicking on a category opens the list of items contained within that category
  */
  $(".category-list").on('click', '.category-item', function(event){
    var $categoryList = $(".category-list");
    var eventCategoryName = event.target.id
    $categoryList.html(`<div class="${eventCategoryName}" text-align="center"><h2>${eventCategoryName}</h2></div>`);
  });


  /*
  Hover over animation for category items
  Enlarges font size by .15em on hover and returns to original on complete
  POSSIBLE IDEA: Change bg color/opacity
  */
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


  /*
  Category Container Close Button
  X button at the top right of the category title. On click returns user
  back to the category list
  */
  $(".category-container").on('click', '#test', function() {
    console.log('test')
  });


});