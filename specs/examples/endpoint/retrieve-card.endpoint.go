RetrieveCardRequest {
  path /creator-cards/:slug
  method GET
  
  query {
	access_code? string<length:6>
  }

  params {
  	slug string<minLength:5|maxLength:50>
  }
  
  response.ok {
    http.code 200
    status successful
    message "Creator Card Retrieved Successfully."
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
		created number
		updated number
		deleted null
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
