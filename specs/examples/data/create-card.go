import ../commons.go

Identity {
  _id string<isUnique> // Unique identifier (ULID)
  title string // User's email address
  description string // card description
  slug string // card's indentifier
  creator_reference string // creator's indentifier
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
  created number // Timestamp of creation
  updated number // Timestamp of last update
  deleted? number // Timestamp of soft deletion (if paranoid mode)
}
