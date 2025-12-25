# 0.2.4

- Fixed bug where commands only worked for last loaded webview
- Store note state (edit/settings etc) to bring back note state when viewing previously unloaded/hidden webview
- Added markdown quick reference to settings pane

# 0.2.3

- On tab within note content input insert 4 spaces rather than focusing next focusable element
- Avoid updating edited notes with possibly stale note edits received by webview
- New icons via @vscode/codicons refresh
- Avoid overlapping note buttons and title
- Allow note header (including title and buttons) to scroll
- Removed animation for overflowing title text

# 0.2.2

- Fix for buttons on note without title
- Default due date displays datetime-local format in input

# 0.2.1

- Bugfix for notes with no title bar breaking webview

# 0.2.0

- Store and retrieve baseURI on reloads
- Addition of creation time to note parameters
- Addition of due date to note parameters
- Display note resize handle only hover
- Updated default number of columns from 6 to 12
- Only allow note to be moved with bounds of grid
- Copy button added to note (grid paste handler needs to be focused to paste note successfully)

# 0.0.2

Fix for note init on page reload

# 0.0.1

Initial release
