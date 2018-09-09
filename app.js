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

var formatString = function(string) {
  return string.replace(/(^|\s)[a-z]/g, function(f) {
    return f.toUpperCase();
  })
};


$(document).ready(function() {
  /*
  jQuery selector variables
  */
  var $inputSearchBar = $("input.search-bar");
  var $addTextBtn = $(".add-text-btn");
  var $userInputTitle = $(".user-input-title");
  var $userInputDesc = $(".user-input-desc");
  var $displayItem = $(".display-item");
  var $addCategoryItem = $(".add-category-item");
  var $categoryRow = $(".category-row");
  var $categoryContainer = $(".category-container");
  var $categoryList = $(".category-list");
  var $categoryDisplay = $(".category-display");


  /* 
  Search bar functionality
  Both on individual keypress (realtime search) and on enter
  */

  $inputSearchBar.on('keyup', function(event) {
    var $searchVal = $inputSearchBar.val();
    if (searchLocalStorage($searchVal) !== false) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });

  $inputSearchBar.on('keypress', function(event) {
    var key = event.which;
    var $searchVal = $inputSearchBar.val();
    if (key === 13) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });


  /*
  Add Item Button
  Adds Item in localStorage as an object.
  */

  $addTextBtn.on("click", function(){
    // store values
    let inputKey = $userInputTitle.val().replace(/\s+/g, '').toLowerCase();
    let inputDesc = $userInputDesc.val();
    let inputCategory = $("select").val();

    if (inputCategory === null) {
      inputCategory = 'unsorted';
    }

    // clear form values
    $userInputTitle.val("");
    $userInputDesc.val("");

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
    $displayItem.on("click", function(e){
      // plop the key:value back into the input boxes

      // get the values from the the divs?
      console.log("key=> ", e.target.dataset.storageKey); // user-input-title
      var test = localStorage.getItem(e.target.dataset.storageKey); // user-input-desc
      console.log(JSON.parse(test));

      // set those values in the form fields
      $userInputTitle.val(e.target.dataset.storageKey);
      $userInputDesc.val(localStorage.getItem(e.target.dataset.storageKey));
    });

  });


  /*
  REMOVED: Delete Button

  $(".del-text-btn").on("click", function() {
    alert('item deleted? check the console'); // maybe change to a window.confirm
    localStorage.removeItem( $('.user-input-title').val() ); // grab the title and plop here
    $userInputTitle.val("");
    $userInputDesc.val("");
  });
  */


  /*
  Add Category Button Functionality
  Prompts users to create a new catgeory and appends it to the end of the category list 
  */
  $categoryRow.on("click", ".add-category-item", function() {
    var category = prompt('New Category Name');
    if (category !== null) {
      if (category !== '') {
        category = category[0].toUpperCase() + category.slice(1);
        $(".content-row select").append(`<option value="${category.toLowerCase()}">${formatString(category)}</option>`);
        $(".category-container").append(`<div class="category-item" id="${category.toLowerCase()}">${formatString(category)}</div>`);
      } else {
        console.log('Category is NULL')
      }
    }
  });


  /*
  Category Button Functianality
  Clicking on a category opens the list of items contained within that category
  */
  $categoryRow.on('click', '.category-item', function(event){
    var eventCategoryName = event.target.id;
    $categoryRow.html(`
    <div class="category-display" id="books">
    <div id="title">${formatString(eventCategoryName)}</div><div id="close">X</div>
    <div class="category-list">
      <div class="item" id="catcher-in-the-rye">Catcher In The Rye</div>
      <div class="item" id="the-bible">The Bible</div>
      <div class="item" id="meditations">Meditations</div>
    </div>
  </div>
    `);
  });


  /*
  Hover over animation for category items
  Enlarges font size by .15em on hover and returns to original on complete
  POSSIBLE IDEA: Change bg color/opacity
  */
  $categoryRow.on({
    mouseenter: function() {
      if (!$(this).hasClass('animated')) { 
        $(this).dequeue().stop().animate({ 
          fontSize: "1.15em"
        }, "300", "swing")
      }
    }, 
    
    mouseleave: function() {
      $(this).addClass('animated').animate({ 
          fontSize: "1em" 
        }, "500", "swing", function() {
          $(this).removeClass('animated').dequeue();
        })
    }
  }, ".category-item");
    
    
  //   "mouseenter", ".category-item", , 
  //   }
  // });

  $categoryRow.on({
    mouseenter: function() {
      if (!$(this).hasClass('animated')) { 
        $(this).dequeue().stop().animate({ 
          fontSize: "2.8em"
        }, "300", "swing")
      }
    }, 
    
    mouseleave: function() {
      $(this).addClass('animated').animate({ 
          fontSize: "2em" 
        }, "500", "swing", function() {
          $(this).removeClass('animated').dequeue();
        })
    }
  }, ".add-category-item");
  
  /*
  Category Container Close Button
  X button at the top right of the category title. On click returns user
  back to the category list
  */
  $categoryRow.on('click', '#close', function() {
    $categoryRow.html(`
    <div class="category-container">
    <div class="add-category-item" id="add-category">+</div>
    <div class="category-item" id="books">Books</div>
    <div class="category-item" id="recipes">Recipes</div>
    <div class="category-item" id="movies">Movies</div>
    <div class="category-item" id="restaurants">Restaurants</div>`);
  });


});