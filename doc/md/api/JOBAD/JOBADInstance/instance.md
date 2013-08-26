# JOBADInstance.Instance

* **Function** `.Instance.focus()` Focuses this JOBADInstance. 
	* **returns** false if the Instance can not be focused for some reason, true otherwise. 
* **Function** `.Instance.unfocus()` Unfocuses this JOBADInstance. 
	* **returns** false if the Instance can not be unfocused for some reason, true otherwise. 
* **Function** `.Instance.isFocused()` Checks if this JOBADInstance is focused. 
	* **returns** true if this JOBADInstance is focused, false otherwise. 
* **Function** `.Instance.focused(callback)` Call a function if this JOBADInstance is focused, otherwise call it once that is true. 
	* **Function** `callback()` Callback to use. 