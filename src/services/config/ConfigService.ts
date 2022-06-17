import * as dotenv from 'dotenv';
import * as fs from 'fs';
import IConfigService from 'services/config/IConfigService';
import {Logger} from '@nestjs/common';

type Dictionary = {[key: string]: string | undefined};

export default class ConfigService implements IConfigService {
  private readonly config: Dictionary;

  constructor(root: string, env: string) {
    this.config = ConfigService.readConfig(
      `${root}.env`,
      `${root}.env.local`,
      `${root}.env.${env}`,
      `${root}.env.${env}.local`,
    );
  }

  get(key: string, defaultValue?: string): string {
    return ConfigService.requireValue(key, this.getOptional(key), defaultValue);
  }

  getOptional(key: string): string | undefined {
    return this.config[key];
  }

  getNumber(key: string, defaultValue?: number): number {
    return ConfigService.requireValue(key, this.getNumberOptional(key), defaultValue);
  }

  getNumberOptional(key: string): number | undefined {
    const valueS = this.getOptional(key);
    if (!valueS) return undefined;
    const value = Number(valueS);
    if (Number.isNaN(value))
      throw new Error(ConfigService.formatEnvError(key, 'is not a number'));
    return value;
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    return ConfigService.requireValue(key, this.getBooleanOptional(key), defaultValue);
  }

  getBooleanOptional(key: string): boolean | undefined {
    const valueS = this.getOptional(key);
    if (!valueS) return undefined;
    switch (valueS) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        throw new Error(ConfigService.formatEnvError(key, 'is not a boolean'));
    }
  }

  private static readConfig(...files: string[]): Dictionary {
    let config: Dictionary = process.env;
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      config = {
        ...config,
        ...ConfigService.readConfigFile(file),
      };
    }
    return config;
  }

  private static readConfigFile(file: string): Dictionary {
    try {
      if (!fs.existsSync(file)) return {};
      return dotenv.parse(fs.readFileSync(file));
    } catch (e) {
      Logger.error(e);
      return {};
    }
  }

  private static formatEnvError(key: string, errorMessage: string) {
    return `env ${key} ${errorMessage}`;
  }

  private static requireValue<TValue>(
    key: string,
    value: TValue | undefined,
    defaultValue: TValue | undefined,
  ): TValue {
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(ConfigService.formatEnvError(key, 'not found'));
    }
    return value;
  }
}
