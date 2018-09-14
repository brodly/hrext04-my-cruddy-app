//Update Storage Prototype to accept Objects
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}
 
//Default Test Data
var categoryList = ['Books', 'Recipes', 'Movies', 'Restaurants'];
var books = {
  'Cosmos': {
    description: '14 billion years of cosmic evolution'
  },

  'The Great Gatsby': {
    description: 'Story of the mysteriously wealthy Jay Gatsby'
  },

  'Mastering Bitcoin' : {
    description: 'Technical foundations of bitcoin'
  },
};

var recipes = {
  'Cheeseburger': {
    description: 'A classic. Mmmm!'
  },

  'Chicken Enchiladas': {
    description: 'Try for a weeknight dinner'
  }
}
var movies = {};
var restaurants = {};

localStorage.setObject('categoryList', categoryList);
localStorage.setObject('Books', books);
localStorage.setObject('Recipes', recipes);
localStorage.setObject('Restaurants', restaurants);
localStorage.setObject('Movies', movies);

// Item Class Prototype
function Item(name, description) {
    var name = name;
    this[name] = {'description': description};
};

// New item entry display Format
var displayItem = function(name, description, category) {
  if (name === 'Corgi' && category === 'Corgi') {
    return `<div class="item ${category}" id="corgi">
    <div class="name">${name}</div>
    <div class="description">${description}</div>
    <div class="settings" id="closed" style="opacity: 0;">
      <i class="fas fa-bars"></i>
    </div>
  </div>`
  }

  return `<div class="item ${category}" id="${name}">
            <div class="name">${name}</div>
            <div class="description">${description}</div>
            <div class="settings" id="closed" style="opacity: 0;">
              <i class="fas fa-bars"></i>
            </div>
          </div>`
};

//Searches Local Storage for matching Item Object and returns if found
var searchLocalStorage = function(term) {
  for (var i of Object.keys(localStorage)) {
    if (i.replace(/\s+/g, '').toLowerCase() === term.replace(/\s+/g, '').toLowerCase()) {
      return i;
    } else {
      return false;
    }
  }
};

var search = function(word) {
  for (var key in localStorage) {
    var check = localStorage.getObject(key)
    for (var prop in check) {
      if (prop === word) {
        return key;
      }
    }
  }
  return false
};

/* 
Formats String to Titlecase
-Beginning of each word is uppercase and the rest of the word is lowercase
i.e Website, Toy Story, This Is My House

Not working with apostrophes (')
*/
var formatString = function(string) {
  return string.replace(/(^|\s)[a-z]/g, function(f) {
    return f.toUpperCase();
  })
};

var addNewItem = function(name, description, category) {
  category = formatString(category);
  name = formatString(name);
  
  if (localStorage.getObject(category) != null) {
    var item = localStorage.getObject(category);
    if (!Object.keys(item).includes(name)) {
      item[name] = { 'description': description }
      localStorage.setObject(category, item);
    } else {
      alert(name + ' already exists!');
      return false;
    } 
  } else {
    var item = new Item(name, description, category);
    localStorage.setObject(category, item);
  }
  return true;
};

var getItemDescription = function(name, category) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        return item[prop].description;
      }
    }
  } 
};

var updateItemName = function(name, category, newName) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        var storedProp = item[prop];
        item[newName] = storedProp;
        delete item[name];
        localStorage.setObject(category, item);
      }
    }
  }
};

var updateItemDescription = function(name, category, newDescription) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        item[prop].description = newDescription;
        localStorage.setObject(category, item);
      }
    }
  } 
};

var isCategoryEmpty = function(category) {
  if (localStorage.getObject(category) === null || Object.keys(localStorage.getObject(category)).length === 0) {
    $(".item-list").append(`<div class="item-holder">You should really add something!</div>`);
  } else {
    return false;
  }
};

var removeItem = function(name, category) {
  if (!isCategoryEmpty(category)) {
    var item = localStorage.getObject(category);
    if (Object.keys(item).includes(name)) {
      delete item[name];
      localStorage.setObject(category, item);
    }
  }
};

//Updates categoryList with string when user adds a new category
var pushToCategoryArray = function(category) {
  if (!categoryList.includes(category)) {
    categoryList.push(category);
    localStorage.setObject("categoryList", categoryList);
    return true;
  } else {
    alert(category + ' already exists!')
    return false;
  }
};

//Removes category string from categoryList
var popFromCategoryArray = function(category) {
  if (categoryList.includes(category)) {
    var index = categoryList.indexOf(category);
    if (index > -1) {
      categoryList.splice(index, 1);
      localStorage.setObject('categoryList', categoryList);
      alert(category + " category removed")
    }
  }
};

//Category List Functions
var populateCategoryList = function() {
  for (var category of categoryList) {
    $(".category-container").append(`<button class="category-item" id='${category}'>${category}</button>`)
  }
};

var addToCategoryList = function(category) {
  $(".category-container").append(`<button class="category-item" id='${category}'>${category}</button>`);
};

var removeFromCategoryList = function(category) {
  if (categoryList.includes(category)) {
    $(`button.category-item:contains(${category})`).remove();
  } else {
    alert(category + ' does not exist!');
  }
};

var openCategoryList = function(category) {
  $(".category-row").html(`
    <div class="category-details" id="${category}">
    <button id="close"><i class="fas fa-chevron-left"></i></button>
    <div id="title">${category}</div>
    <div class="item-list">
    </div>
    </div>
  `); 
    
  if (!isCategoryEmpty(category)) {
    var item = localStorage.getObject(category);
    for (var name in item) {
      var description = getItemDescription(name, category);
      $(".item-list").append(displayItem(name, description, category));
    }
  }

  setCategoryDropdown(category);
};

// Category Dropdown Functions
var populateCategoryDropdown = function(){
  for (var e of categoryList) {
    $("select").append(`<option>${e}</option>`);
  }
};

var addToCategoryDropdown = function(category) {
  $("select").append(`<option selected>${category}</option>`);
};

var removeFromCategoryDropdown = function(category) {
  if (categoryList.includes(category)) {
    $(`option:contains(${category})`).remove();
  } else {
    alert(category + ' does not exist!')
  }
};

var setCategoryDropdown = function(category) {
  $("select").val(category).change();
}

// Add New Category Functions
var createNewCategoryObject = function(category) {
  localStorage.setObject(category, {});
};

var addNewCategory = function(category) {
  if (category !== null) {
    if (category !== '') {
      category = formatString(category);
      if (pushToCategoryArray(category)) {
        addToCategoryDropdown(category);
        addToCategoryList(category);
        createNewCategoryObject(category);
      }
    } else {
      console.log('Category is EMPTY/NULL')
    }
  }
};

//Resets dropdown box to default 'Pick a Category' text
var resetDropdownBox = function() {
  $("select").prop('selectedIndex', '#select-category');
};

/* jQuery Begins */
$(document).ready(function() {
  /* Selector variables*/
  var $inputSearchBar = $("input.search-bar");
  var $addTextBtn = $(".add-text-btn");
  var $displayItem = $(".item");
  var $addCategoryItem = $("button.add-category-item");
  var $categoryRow = $(".category-row");
  var $categoryContainer = $(".category-container");
  var $itemList = $(".item-list");
  var $categoryDisplay = $(".category-details");

  //On Load reset
  resetDropdownBox();
  populateCategoryList();
  populateCategoryDropdown();
  $inputSearchBar.val('');

  // Search functionality
  $inputSearchBar.on('keypress', function(event) {
    var key = event.which;
    var searchTerm = $inputSearchBar.val();
    searchTerm = formatString(searchTerm);
    if (key === 13) {
      var result = search(searchTerm);
      if (result !== false) {
        openCategoryList(result);
      } else {
        alert('No match found. Sorry!')
      }
      $inputSearchBar.val('')
    }
  });

  /* Add Item Button */
  $addTextBtn.on('mousedown', function() {
    $(this).css({"box-shadow":"1px 1px"})   //Click box shadow effect
  });

  $addTextBtn.on("click", function(){
    $(this).css({"box-shadow":""});     //Resets click box shadow effect

    let name = $(".user-input-title").val();
    let description = $(".user-input-desc").val();
    let category = $("select").val();

    if (category === null) {
      alert('You should pick a category!')
    } else {
      if (addNewItem(name, description, category)) {
        var check = Object.keys($(".category-details"));

        if (check.length > 2) {   //checks if category windows is open
          var $categoryDetails = $(".category-details")[0].id  //set category name 
        }

        if ($categoryDetails === category) { // if category window is open
          if ($(".item-holder")) {  //if category window is empty
            $(".item-holder").remove();  //remove empty text
          }
          $(".item-list").append(displayItem(name, description, category)); // append new item entry
        } else {
          alert(`Added ${name} to ${category}`) // if category window is not open alert user item was added
        }
      }
    }

    // Clear/Reset Item Entry Forms
    $(".user-input-title").val("");
    $(".user-input-desc").val("");
    resetDropdownBox();
  });

  //Category Button Prompts users to create a new catgeory and appends it to the end of the category list 
  $categoryRow.on('mousedown', 'button.add-category-item', function() {
    $(this).css({"box-shadow":"1px 1px"})  // hover effect
  });

  $categoryRow.on("click", "button.add-category-item", function() {
    $(this).css({"box-shadow":""})  //remove hover effect
    var category = prompt('Category Name');
    addNewCategory(category);
  });

  // Category Button Functianality
  // Clicking on a category opens the list of items contained within that category
  $categoryRow.on('mouseenter', 'button.category-item', function(event){
    var category = event.target.innerHTML;
    console.log('hover over ' + category + ' category'); // will bring up delete category button
  });

  $categoryRow.on('mousedown', 'button.category-item', function() {
    $(this).css({"box-shadow":"1px 1px"})  //category hover effect
  });

  $categoryRow.on('click', 'button.category-item', function(event){
    $(this).css({"box-shadow":""})
    var category = event.target.innerHTML;
    openCategoryList(category);

  //Remove Category from list functionality
  // if ($("select").val() === category) {
  //   resetDropdownBox();
  // }

  // removeFromCategoryList(category);
  // removeFromCategoryDropdown(category);
  // popFromCategoryArray(category);

  });

  $("select").on("click", "#add-category", function(){
    var category = prompt('Category Name');
    addNewCategory(category);
  });

  // Category Container Back Button
  $categoryRow.on('click', '#close', function() {
    $categoryRow.html('').append('<div class="category-container"><button class="add-category-item" id="add-category">+</div>')
    populateCategoryList();
    resetDropdownBox(); 
  });

  /* Item settings options -- Hover over effects and edit, delete close buttons */
  //Hover over individual item
  $categoryRow.on("mouseenter", ".item", function() {
    var settingsClosed = $(this).children(".settings#closed") // sets settings class with closed ID

    $(settingsClosed).css("opacity", ".3");                   // changes opacity from 0 to .3

    $(settingsClosed).on("mouseenter", function() {           // when mouse enters settings
      $(this).css("opacity", "1");                            // change opacity to from .3 to 1
    });

    $(settingsClosed).on("mouseleave", function() {           // when mouse leaves settings with closed ID
        $(this).css("opacity", ".3");                         // change opacity from 1 to .3
    });

    $('.settings#opened').on('click', function() {
      $(this).prop("id", "closed");
      $(this).html(`<i class="fas fa-bars"></i>`);
    });

    $(settingsClosed).on("click", function() {
      $(this).prop("id", "opened");
      $(this).html(`
        <i class="fas fa-pen" id="edit"></i>
        <i class="far fa-trash-alt" id="delete"></i>
        <i class="fas fa-times" id="close"></i>
      `);

      $('.settings').children('i#edit').on('click', function() {
        var name = $(this).parents('.item').children('.name').html();
        var description = $(this).parents('.item').children('.description').html();
        var category = this.parentNode.parentNode.classList[1];
        $(`.name:contains(${name})`).html(`
          <input type="text" class="edit-name" value="${name}"></input>
        `)

        $(`.description:contains(${description})`).html(`
          <input type="text" class="edit-desc" value="${description}"></input>
          <button class="edit-confirm">Confirm</button>
          <button class="edit-cancel">Cancel</button>
        `)

        $('.edit-cancel').on('click', function(){
          $('.edit-name').parent().html(name);
          $('.edit-desc').parent().html(description);
        });

        $('.edit-confirm').on('click', function(){
          var newName = formatString($('.edit-name').val());
          var newDesc = formatString($('.edit-desc').val());
          
          if (newName !== name) {
            $('.edit-name').parent().html(newName);
            updateItemName(name, category, newName);
          } else {
            $('.edit-name').parent().html(name);
          }

          if (newDesc !== description) {
            $('.edit-desc').parent().html(newDesc);
            updateItemDescription(name, category, newDesc);
          } else {
            $('.edit-desc').parent().html(description);
          }

        });
      });
  
      $('.settings').children('i#delete').on('click', function() {
        var name = $(this).parents('.item').children('.name').html();
        var category = this.parentNode.parentNode.classList[1];
        var confirm = window.confirm('Are you sure you want to delete ' + name);
        if (confirm) {
          $(`.item:contains(${name})`).remove()
          removeItem(name, category);
        }
        isCategoryEmpty(category);
        });
    });
  });

  // Hover off effect when user mouse leaves item
  $categoryRow.on("mouseleave", ".item", function(event){
    var $settings = $(this).children(".settings");
    $settings.css("opacity", "0");
  });

});