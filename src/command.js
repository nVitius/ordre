import Argument from './argument';
import Option from './option';

class Command {

  /**
   * @param {String} name
   */
  constructor(name) {
    this._name = name;

    /**
     * @type {Array.<Argument>}
     * @private
     */
    this._arguments = [];

    /**
     * @type {Array.<Option>}
     * @private
     */
    this._options = [];

    this._configure();

    if (!this._name) {
      throw new Error('Command cannot have an empty name');
    }
  }

  _configure() {
  }

  /** @param {String} name */
  set name(name) {
    this._name = name;
  }

  /** @returns {String} */
  get name() {
    return this._name;
  }

  /** @returns {Array.<Argument>} */
  get arguments() {
    return this._arguments;
  }

  /** @returns {Array.<Option>} */
  get options() {
    return this._options;
  }

  run() {
    throw new Error(`Method run() needs to be implemented for Command ${this.name}`)
  }

  /**
   * Creates and attaches a new Argument to this Command
   *
   * @param {String} name Name for this argument
   * @param {Number} [options] Config options. One of the ARG_* constants.<br>
   *                         Defaults to ARG_OPTIONAL
   * @param {String} description Description to show in help()
   * @param {*} def Default value for this argument
   */
  addArgument(
    name,
    options = null,
    description = '',
    def = null
  ) {
    var argument = new Argument(name, options, description, def);

    for (let argName in this.arguments) {
      if(!this.arguments.hasOwnProperty(argName)) continue;

      let arg = this.arguments[argName];
      if (argument.isRequired() && arg.isOptional()) {
        throw new Error('Cannot specify an ARG_REQUIRED after ARG_OPTIONAL');
      }

      if (arg.isArray()) {
        throw new Error('Cannot add another Argument after an ARG_ARRAY');
      }
    }


    this._arguments[name] = argument;
  }

  /**
   * Creates and attaches a new Option to this Command
   *
   * @param {String} name Can be passed w/ or w/o '--' prefixed
   * @param {String} shortcut One-character string to be used as short-hand name
   * @param {Number} options Config options. One of the OPT_* constants.<br>
   *                         Defaults to OPT_EMPTY
   * @param {String} description Descirption to show in help()
   * @param {*} def Default value for this option
   */
  addOption(
    name,
    shortcut,
    options,
    description = '',
    def = null
  ) {
    if (name.indexOf('--') === 0) {
      name = name.substr(2);
    }

    this._options[name] = new Option(name, shortcut, options, description, def);
  }
}

export default Command
