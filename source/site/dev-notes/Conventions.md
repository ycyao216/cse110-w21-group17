## Paths
- The frontend site always run ``/source/site/frontend`` as root
- Please use *Absolute Path* in all the files. That is, all paths starts with a ``/``, which points to ``/source/site/frontend``

## Files Organization

### CSS
- For each ``x.html`` file, there is always a ``x.css`` file in the css folder that records the style used **only** in ``x.html``
- For shared modules, there may be other ``y.css`` file for the style of the module
- For styling for elements like buttons (globally), there may be ``ui-z.css`` in the css folder
- For styling for web components, there may be ``comp-z.css`` in the css folder

## Data Synchronization
- Currently, data storage and synchronization are implemented using ``localStorage`` api
