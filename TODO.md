# What is this?
An app that collects and organizes a users wants, needs, and interests. Instead of looking through a mess of notes, emails and texts of ideas or recommendations (i.e books, tv shows, restaurants, clothes, etc.) a user can simply input the thing they want and the app will categorize/organize the items for them.

# MVP
- [√] store items
- [√] create new item
- [√] select item
- [√] edit/update item
- [√] delete item

# Detail Todo
### Front End
- [√] display items
  - [√] display items in respected categories
- [√] remove items from display
- [√] enter new item
- [√] select item for edit
- [√] select item for delete
  - [√] confirm delete box
- [√] a form!
- [√] search bar
- [√] items should be objects

### Backend
- [√] Put categoryList into Local Storage
- [√] Refactor category input code to append new categories to categoryList array

### UI/UX
- [√] Confirmation of delete/update
- [ ] Sortable list
- [√] Navigation/Pagination
- [ ] Mouse over Preview
- [√] Searching/Filtering
- [ ] Animations/Transitions

### Library Considerations
- [ ] underscore
- [√] jquery
- [ ] moments.js
- [ ] c3.js (charts.js)

# Next Steps
- [√] factor out common functionality
- [√] testing

# Feature list
### Difficulty Scale (from 1 to 10 )
 2.5 days === 20 hours
- 1 = finished/simple to complete 
- 2 = 1 hour
- 5 = 3 hours
- 7 = 5 hours
- 10 = full day+

## basic features
- [√] Populate index.html on first load with new items and categories 
- [√] search form at top
- [√] input item form under search
  - [√] adding items has dropdown list with general categories
  - [√] + button to add new category
- [√] categories to hold specific items below input
  - [√] grid based layout 3 x 4 (3 across/infinte down?)
- [√] Category page needs to be dynamic   
- [√] edit items
  - [√] functionality
  - [√] build UI
  - [√] hover over edit options
- [√] populate dropdown category from category array  
- [√] fully delete category
  - [√] button for delete
  - [√] delete from dropdown list
  - [√] what to do with items in a deleted category?? 
- [√] secret corgi easter egg when user added corgi to specific category  

## advanced features
- [3] select and delete multiple items (highlight/checkbox?)
- [√] add/leave comments on item
- [2] share items/categories to social media
- [2] due date
- [2] add timestamps to each item
  - [2] format with moments.js
- [√] mouse over items for more detail
- [3] pull category images from flickr
  - [3] user can add image to represent categories/items
- [3] set item importance/priority
  - [2] color code priority
- [3] implement jQuery-color for animations (https://github.com/jquery/jquery-color)

## complex features
- [8] search auto completes (search/filter on keyup/keydown) (https://github.com/devbridge/jQuery-Autocomplete)
- [9] item input and search as one form (app detects if new item or already exists)
- [8] pagination/infinity scroll (if more than 10 show a next button)
- [5] reminders 
  - [9] push operation
- [6] history of deleted items
  - [2] user can decide how long items stay in history
- [7] options page
  - [2] font changes/choices? (google fonts)
  - [6] night mode theme
  - [7] color layout/themes

 ## design ideas
- [-] fillet edges of boxes
- [-] strike-through completed/deleted items