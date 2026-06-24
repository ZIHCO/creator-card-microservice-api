CreateCardRequest {
  path /creator-cards
  method POST
  
  body {
	title string<trim|minLength:3|maxLength:100>
	description? string<trim|maxLength:500>
	slug? string<trim|minLength:5|maxLength:50>
	creator_reference string<trim|length:20>
	links[]? {
		title string<trim|minLength:1|maxLength:100>
		url string<trim|startWith:http>
	}
	service_rates? {
		currency string(NGN|USD|GBP|GHS)
		rates[] {
		name string<trim|minLength:3|maxLength:100>
		description string<trim|maxLength:250>
		amount number<min:1>
		}
	}
	status string(draft|published)
	access_type? string(public|private)
	access_code? string<trim|length:6>
  }
  
  response.ok {
    http.code 200
    status successful
    message "Creator Card Created Successfully."
    data {
		id string<length:26>
		title string
		description? string
		slug? string
		creator_reference string
		links[]? {
			title string
			url string
		}
		service_rates? {
			currency string
			rates[] {
			name string
			description string
			amount number
			}
		}
		status string
		access_type? string
		access_code? null
		created number
		updated number
		deleted null
    }
  }
  
  response.error {
    http.code 400
    status error
    message string
    errors {
    	code string
    }
  }
}
