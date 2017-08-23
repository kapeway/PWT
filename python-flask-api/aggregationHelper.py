#aggregationHelper.py:
def get_policy_for_claim_no(sno):
  pipeline = [
      {
    "$match": {
      "sno":sno
    }
  },
  {
    "$lookup": {
    "from" : "policydata",
    "localField" : "policyNumber",
    "foreignField" : "policyNumber",
    "as" : "policyDataMatch"
    }
  },
  {
    "$project": {
    "policyDataMatchForSno":{"$arrayElemAt": [ "$policyDataMatch", 0 ]},
    "policyNumber":"$policyNumber"
    }
  },
  {
    "$project": {
    "customerEmail":"$policyDataMatchForSno.customerEmail",
    "policyNumber":"$policyNumber"
    }
  }
  ]
  return pipeline

def get_weekly_premium():
  pipeline = [
    {
        "$project": {
            "year":{"$year":"$datetime"},
            "month":{"$month":"$datetime"},
            "week":{"$week":"$datetime"},
            "policyType":"$policyType",
            "premium":"$premium"
        }
    },
    {
        "$group": {
            "_id":{
        "policyType":"$policyType",
        "year":"$year",
        "month":"$month",
        "week":"$week",
            },
        "premium":{"$sum":"$premium"}
        }
    },
    {
        "$sort": {
        "_id.policyType":1,
        "_id.year":1,
        "_id.month":1,
        "_id.week":1
        }
    },
    {
        "$group": {
            "_id":{"policyType":"$_id.policyType"},
            "premiumForDuration":{"$push":{"year":"$_id.year","month":"$_id.month","week":"$_id.week","premium":"$premium"}}
        }
    },
    {
        "$project": {
        "policyType":"$_id.policyType",
        "premiumForDuration":"$premiumForDuration"
        }
    },
]
  return pipeline

def get_monthly_premium():
  pipeline = [
        {
			"$project": {
			  "year":{"$year":"$datetime"},
			  "month":{"$month":"$datetime"},
			  "policyType":"$policyType",
			  "premium":"$premium"
			}
		},
		{
			"$group": {
			  "_id":{
			"policyType":"$policyType",
			"year":"$year",
			"month":"$month",
			  },
			"premium":{"$sum":"$premium"}
			}
		},
		{
			"$sort": {
			"_id.policyType":1,
			"_id.year":1,
			"_id.month":1
			}
		},
		{
			"$group": {
			  "_id":{"policyType":"$_id.policyType"},
			  "premiumForDuration":{"$push":{"year":"$_id.year","month":"$_id.month","premium":"$premium"}}
			}
		},
		{
			"$project": {
			"policyType":"$_id.policyType",
			"premiumForDuration":"$premiumForDuration"
			}
		},
	]    
  return pipeline    