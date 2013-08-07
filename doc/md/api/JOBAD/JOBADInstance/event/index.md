# JOBADInstance.Event

* **Function** `.Event.on(event, handler)` - Adds an event listener. 
    * **String** `event` Event to listen to. 
    * **Function* `handler(param1, param2, ...)` Event listener
    * **returns** Id of the newly added handler. 

* **Function** `.Event.once(event, handler)` - Adds a one-time  event listener. 
    * **String** `event` Event to listen to. 
    * **Function* `handler(param1, param2, ...)` Event listener
    * **returns** Id of the newly added handler. 

* **Function** `.Event.off(id)` - Removes an event listener. 
    * **String** `id` Id of handler to remove. 

* **Function** `JOBAD.util.trigger(event, params)` - Triggers an event. 
    * **String** `event` Event to trigger. 
    * **Array** `params` Optional. Array of parameters to pass to event handlers.
    * **returns** `Array of results`

The following event names are available: 


* `module.activate($module)` The module $module was activated. 
* `module.deactivate($module)` The module $module was deactivated. 

* `instance.enable` This JOBADInstance was enabled. 
* `instance.disable` This JOBADInstance was disabled. 

* `module.load($module, $options)` The module $module was loaded successfully. 
* `module.fail($module, $reason)` The module $module has failed to load. 

* `contextmenu.open` After the context menu has been opened
* `contextmenu.close` After the context menu has been closed

* **unimplemented**: 
    * `instance.focus` This JOBADInstance was focused. 
    * `instance.unfocus` This JOBADInstance was unfocused. 

* `event.before.$name($name, params)`: Triggered before an event occurs. 
* `event.after.$name($name, params)`: Triggered after an event occurs. 
* `$name(params)`: Triggered once an event result is fetched. 

`$name` can take the following values: 

* `leftClick` - Double click on an element
* `dblClick` - Double click on an element
* `contextMenuEntries` - Context Menu of an element is requested
* `configUpdate` - A specific configuration setting is updated
* `hoverText` - Hover Text requested on an element
* `SideBarUpdate`- The sidebar is updated. 

* `event.handlable($evt, $params)`: triggered on any handable event. (An event that can be handled by the onEvent Handler). 

# The following specific Event Namespacesare available: 

* **Object** [`.Event.dblClick`](dblClick.md) Namespace for dblClick Events. 
* **Object** [`.Event.leftClick`](leftClick.md) Namespace for leftClick Events. 
* **Object** [`.Event.contextMenuEntries`](contextMenuEntries.md) Namespace for contextMenuEntries Events. 
* **Object** [`.Event.hoverText`](hoverText.md) Namespace for hoverText Events. 
* **Object** [`.Event.configUpdate`](configUpdate.md) Namespace for onConfigUpdate Events. 
* **Object** [`.Event.SideBarUpdate`](SideBarUpdate.md) Namespace for SideBarUpdate Events. 
* **Object** [`.Event.onEvent`](onEvent.md) Namespace for onEvent Events. 


## See also

* [`JOBAD.events`](../../JOBAD.events/index.md)
