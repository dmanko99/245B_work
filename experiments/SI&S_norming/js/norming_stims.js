
var firsts = [
    "DeShaun", "DeShaun", "DeShaun", "DeShaun", "DeShaun", 
    "Conner", "Conner", "Conner", "Conner", "Conner"
]

var scales = [
	{weak: "or", strong: "and"},
	{weak: "some", strong: "all"},
	{weak: "looks like", strong: "is"},
	{weak: "possible", strong: "certain"},
	{weak: "may", strong: "will"},
	{weak: "three", strong: "more than three"}
]

var stories = [
	{
		story: "or/and stealing",
		storyline: "FIRST has stolen a car and a bicycle.",
		tag: "evoke",
		scaleType: 0,
	},
	{
		story: "or/and violent crime",
		storyline: "FIRST has been found guilty of theft and violent crime.",
		tag: "evoke",
		scaleType: 0,
	},
	{
		story: "or/and threat",
		storyline: "FIRST has threatened a judge and a police officer.",
		tag: "evoke",
		scaleType: 0,
	},
	{
		story: "or/and not stealing",
		storyline: "FIRST has had his car and his bicycle stolen.",
		tag: "repress",
		scaleType: 0,
	},
	{
		story: "or/and not violent crime",
		storyline: "FIRST has been a victim of theft and violence.",
		tag: "repress",
		scaleType: 0,
	},
	{
		story: "or/and not police",
		storyline: "FIRST has worked as a judge and a police officer.",
		tag: "repress",
		scaleType: 0,
	},
	{
		story: "some/all criminal",
		storyline: "All of FIRST's friends are criminals.",
		tag: "evoke",
		scaleType: 1,
	},
	{
		story: "some/all violent",
		storyline: "All of FIRST's brothers are violent.",
		tag: "evoke",
		scaleType: 1,
	},
	{
		story: "some/all prison",
		storyline: "All of FIRST's cousins have spent time in prison.",
		tag: "evoke",
		scaleType: 1,
	},	
	{
		story: "some/all respect",
		storyline: "All of FIRST's friends respect the police.",
		tag: "repress",
		scaleType: 1,
	},
	{
		story: "some/all police",
		storyline: "All of FIRST's brothers are police officers.",
		tag: "repress",
		scaleType: 1,
	},
	{
		story: "some/all prison work",
		storyline: "All of FIRST's cousins work at a prison.",
		tag: "repress",
		scaleType: 1,
	},
	{
		story: "looks like/is criminal",
		storyline: "FIRST is a criminal.",
		tag: "evoke",
		scaleType: 2,
	},
	{
		story: "looks like/is thief",
		storyline: "FIRST is a thief.",
		tag: "evoke",
		scaleType: 2,
	},
	{
		story: "looks like/is dangerous",
		storyline: "FIRST is a dangerous person.",
		tag: "evoke",
		scaleType: 2,
	},
	{
		story: "looks like/is police",
		storyline: "FIRST is a police officer.",
		tag: "repress",
		scaleType: 2,
	},
	{
		story: "looks like/is judge",
		storyline: "FIRST is a judge.",
		tag: "repress",
		scaleType: 2,
	},
	{
		story: "looks like/is respect",
		storyline: "FIRST is someone who respects the law.",
		tag: "repress",
		scaleType: 2,
	},
	{
		story: "possible/certain jail",
		storyline: "It is certain that FIRST is an inmate.",
		tag: "evoke",
		scaleType: 3,
	},
	{
		story: "possible/certain stealing",
		storyline: "It is certain that FIRST stole a TV from Walmart last week.",
		tag: "evoke",
		scaleType: 3,
	},
	{
		story: "possible/certain violence",
		storyline: "It is certain that FIRST has attacked someone at the park.",
		tag: "evoke",
		scaleType: 3,
	},
	{
		story: "possible/certain not jail",
		storyline: "It is certain that FIRST is a prison guard.",
		tag: "repress",
		scaleType: 3,
	},
	{
		story: "possible/certain police",
		storyline: "It is certain that FIRST wants to be a police officer.",
		tag: "repress",
		scaleType: 3,
	},
	{
		story: "possible/certain not violence",
		storyline: "It is certain that FIRST avoids violent people.",
		tag: "repress",
		scaleType: 3,
	},
	{
		story: "may/will prison",
		storyline: "FIRST will one day be sent to prison.",
		tag: "evoke",
		scaleType: 4,
	},
	{
		story: "may/will violent",
		storyline: "FIRST will one day commit a violent crime.",
		tag: "evoke",
		scaleType: 4,
	},
	{
		story: "may/will no police",
		storyline: "FIRST will one day attack a police officer.",
		tag: "evoke",
		scaleType: 4,
	},
	{
		story: "may/will police",
		storyline: "FIRST will one day join the police force.",
		tag: "repress",
		scaleType: 4,
	},
	{
		story: "may/will crime",
		storyline: "FIRST will one day get mugged.",
		tag: "repress",
		scaleType: 4,
	},
	{
		story: "may/will judge",
		storyline: "FIRST will become a judge.",
		tag: "repress",
		scaleType: 4,
	},
	{
		story: "n/n+m crime",
		storyline: "FIRST has committed more than three violent crimes.",
		tag: "evoke",
		scaleType: 5,
	},
	{
		story: "n/n+m prison",
		storyline: "FIRST has been sent to prison more than three times.",
		tag: "evoke",
		scaleType: 5,
	},
	{
		story: "n/n+m murder",
		storyline: "FIRST has threatened to kill more than three people.",
		tag: "evoke",
		scaleType: 5,
	},
	{
		story: "n/n+m stolen",
		storyline: "FIRST has had his wallet stolen more than three times.",
		tag: "repress",
		scaleType: 5,
	},
	{
		story: "n/n+m victims",
		storyline: "FIRST knows more than three victims of violent crime.",
		tag: "repress",
		scaleType: 5,
	},
	{
		story: "n/n+m police",
		storyline: "FIRST has more than three relatives who are police officers.",
		tag: "repress",
		scaleType: 5,
	}
]