RetrieveCardRequest {
  path /creator-cards/:slug
  method DELETE
  
  body {
	creator_reference string<trim|length:20>
  }

  params {
  	slug string<minLength:5|maxLength:50>
  }
  
  response.ok {
    http.code 200
    status successful
    message "Creator Card Deleted Successfully."
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
		access_code? string
		created number
		updated number
		deleted number
    }
  }
  
  response.error {
    http.code 403
    status error
    message string
	errors {
		code string
	}
  }
    
  response.error {
    http.code 404
    status error
    message string
	errors {
		code string
  	}
  }
}
