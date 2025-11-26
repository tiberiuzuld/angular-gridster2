### Simple solution

What is implemented here is a `parentDynamicComponent` which is inserted in all widgets and inside it is using `*ngIf`
to initialize the correct widget depending on it's `type`. To communicate resize, drag and other events added code with
EventEmitters. For more info look at source code of this demo.

### Alternative

You can load dynamic components with `NgComponentOutlet` more info [NgComponentOutlet](https://angular.dev/api/common/NgComponentOutlet)
