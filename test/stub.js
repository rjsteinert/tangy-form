const stub = {
  locationList: {
    "locationsLevels": ["county", "school"],
    "locations": {
      "county1": {
        "id": "county1",
        "label": "County 1",
        "children": {
          "school1": {
            "id": "school1",
            "label": "School 1",
            "latitude": 44.46567,
            "longitude": -73.21911
          },
          "school2": {
            "id": "school2",
            "label": "School 2",
            "latitude": 44.45308,
            "longitude": -73.19576
          }
        }
      },
      "county2": {
        "id": "county2",
        "label": "County 2",
        "children": {
          "school3": {
            "id": "school3",
            "label": "School 3",
            "latitude": 44.46567,
            "longitude": -73.21911

          },
          "school4": {
            "id": "school4",
            "label": "School 4",
            "latitude": 44.46567,
            "longitude": -73.21911

          }
        }
      }
    }
  },
  flatLocationList: {"locationsLevels":["county","school"],"locations":[{"id":"county2","label":"County 2","children":{},"parent":"root"},{"id":"school4","label":"School 4","latitude":44.46567,"longitude":-73.21911,"parent":"county2","children":{}},{"id":"school3","label":"School 3","latitude":44.46567,"longitude":-73.21911,"parent":"county2","children":{}},{"id":"county1","label":"County 1","children":{},"parent":"root"},{"id":"school2","label":"School 2","latitude":44.45308,"longitude":-73.19576,"parent":"county1","children":{}},{"id":"school1","label":"School 1","latitude":44.46567,"longitude":-73.21911,"parent":"county1","children":{}}]} 
}

export default stub
