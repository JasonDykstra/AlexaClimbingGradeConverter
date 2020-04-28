// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');

//Dictionaries containing the conversions between bouldering grades
var VToFont = {
  "V0": "4",
  "V1": "5",
  "V2": "5+",
  "V3": "6A",
  "V4": "6B",
  "V5": "6C",
  "V6": "7A",
  "V7": "7A+",
  "V8": "7B",
  "V9": "7C",
  "V 10": "7C+",
  "V 11": "8A",
  "V 12": "8A+",
  "V 13": "8B",
  "V 14": "8B+",
  "V 15": "8C",
  "V 16": "8C+",
}

var FontToV = {
  "4": "V0",
  "5": "V1",
  "5 plus": "V2",
  "6A": "V3",
  "6A plus": "V3",
  "6B plus": "V4",
  "6C": "V5",
  "6C plus": "V5",
  "7 a": "V6",
  "78 plus": "V7",
  "7A plus": "V7",
  "7B": "V8",
  "7B plus": "V8",
  "7C": "V9",
  "7C plus": "V10",
  "8A": "V11",
  "8A plus": "V12",
  "8B": "V13",
  "8B plus": "V14",
  "8C": "V15",
  "8C plus": "V16",
}

//Handler for testing if the skill is alive by saying Hello
const HelloHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
      && request.intent.name === 'HelloIntent');
  },
  handle(handlerInput) {
    const speechOutput = "Hello";
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};



//Handler for converting V grades to Font
const ConvertVGradeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    //checks request type
    return (request.type === 'IntentRequest'
      && request.intent.name === 'ConvertVGradeIntent');
  },
  handle(handlerInput) {
    //get the custom slot value from the command (in this case, the V grade)
    var slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'VGrade');

    //output
    var speechOutput = slotValue + " in the Font system is " + VToFont[slotValue];
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

//Handler for converting Font grades to V
const ConvertFontGradeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    //checks request type
    return (request.type === 'IntentRequest'
      && request.intent.name === 'ConvertFontGradeIntent');
  },
  handle(handlerInput) {
    //get custom slot value (in this case, the Font grade)
    var slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'FontGrade');
    var speechOutput= "";

    //For some reason, sometimes when I tell Alexa "7A plus" the NLU interprets
    //it as "78 plus" so I made a quick exception for that.
    if(slotValue === '78 plus'){
      speechOutput += "7A plus";
    } else {
      speechOutput += slotValue;
    }

    //output
    speechOutput += " in the Font system is " + FontToV[slotValue];
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};


//Handler for launch command
const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    //checks request type
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = "Welcome to Jason's climbing grade converter. You can ask me to convert V grades to Font, and visa versa."
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

//============================== Built in Handlers ==============================
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    // Gets the locale from the request and initializes i18next.
    const localizationClient = i18n.init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
      returnObjects: true
    });
    // Creates a localize function to support arguments.
    localizationClient.localize = function localize() {
      // gets arguments through and passes them to
      // i18next using sprintf to replace string placeholders
      // with arguments.
      const args = arguments;
      const value = i18n.t(...args);
      // If an array is used then a random value is selected
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    // this gets the request attributes and save the localize function inside
    // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    }
  }
};

//===============================================================================

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    HelloHandler,
    ConvertVGradeHandler,
    ConvertFontGradeHandler,
    LaunchHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();



const enData = {
  translation: {
    SKILL_NAME: 'Climbing Grade Converter',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'Tell me to convert a bouldering grade.',
    HELP_REPROMPT: 'What can I convert for you?',
    FALLBACK_MESSAGE: 'Sorry, that command wasn\'t recognized.',
    FALLBACK_REPROMPT: 'What can I convert for you?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
  },
};

const enusData = {
  translation: {
    SKILL_NAME: 'American Space Facts',
  },
};


// constructs i18n and l10n data structure
const languageStrings = {
  'en': enData,
  'en-US': enusData,
};

