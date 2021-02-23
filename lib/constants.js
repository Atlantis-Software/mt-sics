module.exports = {
  'I0': {
    list: {
      'I0 B': ['level', 'command']
    },
    success: {
      'I0 A': null
    },
    errors: {
      'I0 I': 'Command understood but not executable at present'
    }
  },
  'I1': {
    success: {
      'I1 A': ['levels', 'sics0_ version', 'sics1_ version', 'sics2_ version', 'sics3_ version']
    },
    errors: {
      'I1 I': 'Command understood but not executable at present'
    }
  },
  'I2': {
    success: {
      'I2 A': ['data']
    },
    errors: {
      'I2 I': 'Command understood but not executable at present'
    }
  },
  'I3': {
    success: {
      'I3 A': ['software_version']
    },
    errors: {
      'I3 I': 'Command understood but not executable at present'
    }
  },
  'I4': {
    success: {
      'I4 A': ['serial_number']
    },
    errors: {
      'I4 I': 'Command understood but not executable at present'
    }
  },
  'I5': {
    success: {
      'I5 A': ['software_id']
    },
    errors: {
      'I5 I': 'Command understood but not executable at present'
    }
  },
  'S': {
    success: {
      'S S': ['weight', 'unit']
    },
    errors: {
      'S I': 'Command understood but not executable at present',
      'S +': 'Scale in overload range',
      'S -': 'Scale in underload range'
    }
  },
  'SI': {
    success: {
      'S S': ['stable_weight', 'unit'],
      'S D': ['dynamic_weight', 'unit']
    },
    errors: {
      'S I': 'Command understood but not executable at present',
      'S +': 'Scale in overload range',
      'S -': 'Scale in underload range'
    }
  },
  'Z': {
    success: {
      'Z A': 'Command executed successfully'
    },
    errors: {
      'Z I': 'Command understood but not executable',
      'Z +': 'Upper limit of zero setting range exceeded',
      'Z -': 'Lower limit of zero setting range exceeded'
    }
  },
  'ZI': {
    success: {
      'ZI D': 'Zero setting performed under dynamic conditions',
      'ZI S': 'Zero setting performed under stable conditions'
    },
    errors: {
      'Z I': 'Command understood but not executable',
      'Z +': 'Upper limit of zero setting range exceeded',
      'Z -': 'Lower limit of zero setting range exceeded'
    }
  },
  '@': {
    success: {
      'IA A': ['serial_number']
    },
    errors: {
      'IA I': 'Command understood but not executable'
    }
  }
};