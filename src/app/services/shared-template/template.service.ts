import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TemplateService {

	constructor() { }

	quickReplyTemplate(quick_replyMsg) {
		let data = {
			'from': 'user',
			'message': {
				'quick_replies': [quick_replyMsg]
			}
		};
		return data;
	}

	buttonTemplate(text, button) { 
		let data = {
			'from': 'user',
			'message': {
			    attachment: {
			      type: "template",
			      payload: {
			        template_type: "button",
			        text: text,
			        buttons: [button]
			      }
			    }
			  }
		};
		return data;
	}

	menuButtonTemplate(title, payload) {
        let data = {
            'from': 'user',
            'message': {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "button",
                    text: null,
                    buttons: [
                    	{
                    		type: "postback", title: title, payload: payload
                    	}
                   	]
                  }
                }
              }
        };
        return data;
    }

	textTemplate(message) {
		let timestamp = Date.now()
		let data = { 
			'from': 'user', 
			'message': 
			{ 
				'text': (message).trim(),
				'timestamp': timestamp 
			} 
		};
		return data
	}

	dropdownTemplate(dropdownMsg) {
		let data = {
			'from': 'user',
      		'message': {
        		'dropdown': dropdownMsg
      		}
		};
		return data
	}
}
