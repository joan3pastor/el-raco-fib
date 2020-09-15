
export const horari_buit = {
    "count": 4,
    "results": []
}

export const normal_horari = {
    "count": 4,
    "results": [
        {
            "codi_assig": "ROB", 
            "grup": "10",     
            "dia_setmana": 1,
            "inici": "16:00",
            "durada": 2,
            "tipus": "T",
            "aules": "C6S303" 
        },
        {
            "codi_assig": "ASDP",
            "grup": "10",
            "dia_setmana": 2,
            "inici": "14:00",
            "durada": 2,
            "tipus": "T",
            "aules": "A5104"
        },
        {
            "codi_assig": "ROB",
            "grup": "11",
            "dia_setmana": 2,
            "inici": "16:00",
            "durada": 2,
            "tipus": "L",
            "aules": "Online"
        },
        {
            "codi_assig": "ASDP",
            "grup": "10",
            "dia_setmana": 4,
            "inici": "14:00",
            "durada": 2,
            "tipus": "P",
            "aules": "A5104"
        }
    ]
}

export const horari_with_overlap = {
    "count": 5,
    "results": [
        {
            "codi_assig": "AS",
            "grup": "10",
            "dia_setmana": 1,
            "inici": "16:00",
            "durada": 2,
            "tipus": "T",
            "aules": "A6102"
        },{
            "codi_assig": "ROB",
            "grup": "10",
            "dia_setmana": 1,
            "inici": "16:00",
            "durada": 2,
            "tipus": "T",
            "aules": "C6S303"
        },
        {
            "codi_assig": "ASDP",
            "grup": "10",
            "dia_setmana": 2,
            "inici": "14:00",
            "durada": 2,
            "tipus": "T",
            "aules": "A5104"
        }
    ]
}

export const parsed_horari_buit = [
    {},
    {
      "1": {},
      "2": {},
      "3": {},
      "4": {},
      "5": {}
    }
];

export const parsed_horari = [
    {
        "ASDP": "#baffc9",
        "ROB": "#bae1ff",
    },
    {
        "1":  {
        "16":  {
            "aules": "C6S303",
            "grup": "10",
            "nom": "ROB",
            "tipus": "T",
        },
        "17":  {
            "aules": "C6S303",
            "grup": "10",
            "nom": "ROB",
            "tipus": "T",
        },
        },
        "2":  {
        "14":  {
            "aules": "A5104",
            "grup": "10",
            "nom": "ASDP",
            "tipus": "T",
        },
        "15":  {
            "aules": "A5104",
            "grup": "10",
            "nom": "ASDP",
            "tipus": "T",
        },
        "16":  {
            "aules": "No presencial",
            "grup": "11",
            "nom": "ROB",
            "tipus": "L",
        },
        "17":  {
            "aules": "No presencial",
            "grup": "11",
            "nom": "ROB",
            "tipus": "L",
        },
        },
        "3":  {},
        "4":  {
        "14":  {
            "aules": "A5104",
            "grup": "10",
            "nom": "ASDP",
            "tipus": "P",
        },
        "15":  {
            "aules": "A5104",
            "grup": "10",
            "nom": "ASDP",
            "tipus": "P",
        },
        },
        "5": {},
    }
];

export const parsed_horari_with_overlap = [
    {
      "AS": "#bae1ff",
      "ASDP": "#ffb3ba",
      "ROB": "#baffc9",
    },
    {
      "1": {
        "16": [
          {
            "aules": "A6102",
            "grup": "10",
            "nom": "AS",
            "tipus": "T",
          },
          {
            "aules": "C6S303",
            "grup": "10",
            "nom": "ROB",
            "tipus": "T",
          },
        ],
        "17": [
          {
            "aules": "A6102",
            "grup": "10",
            "nom": "AS",
            "tipus": "T",
          },
          {
            "aules": "C6S303",
            "grup": "10",
            "nom": "ROB",
            "tipus": "T",
          },
        ],
      },
      "2": {
        "14": {
          "aules": "A5104",
          "grup": "10",
          "nom": "ASDP",
          "tipus": "T",
        },
        "15": {
          "aules": "A5104",
          "grup": "10",
          "nom": "ASDP",
          "tipus": "T",
        },
      },
      "3": {},
      "4": {},
      "5": {},
    },
];

export const normal_class = {
  "aules": "C6S303",
  "grup": "10",
  "nom": "ROB",
  "tipus": "T",
};

export const overlapped_class_1 = [
  {
    "aules": "A6102",
    "grup": "10",
    "nom": "AS",
    "tipus": "T",
  },
  {
    "aules": "C6S303",
    "grup": "10",
    "nom": "ROB",
    "tipus": "T",
  }
];

export const overlapped_class_2 = [
  {
    "aules": "A6102",
    "grup": "10",
    "nom": "AS",
    "tipus": "T",
  },
  {
    "aules": "C6S303",
    "grup": "14",
    "nom": "ROB",
    "tipus": "L",
  },
  {
    "aules": "A6102",
    "grup": "12",
    "nom": "AS",
    "tipus": "T",
  }
];