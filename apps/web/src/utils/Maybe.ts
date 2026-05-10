export class Maybe<T> {
  private readonly value: T | null | undefined;

  private constructor(value: T | null | undefined) {
    this.value = value;
  }

  static some<T>(value: T): Maybe<T> {
    if (value === null || value === undefined) {
      throw new Error(
        "Cannot create Maybe.some with a null or undefined value",
      );
    }
    return new Maybe(value);
  }

  static none<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  static fromValue<T>(value: T | null | undefined): Maybe<T> {
    if (value === null || value === undefined) {
      return new Maybe<T>(null);
    }
    return new Maybe<T>(value);
  }

  isSome(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  isNone(): boolean {
    return !this.isSome();
  }

  getOrNull(): T | null {
    return this.isSome() ? (this.value as T) : null;
  }

  getOrElse(defaultValue: T): T {
    return this.isSome() ? (this.value as T) : defaultValue;
  }

  map<R>(fn: (value: T) => R): Maybe<R> {
    if (this.isNone()) {
      return Maybe.none<R>();
    }
    return Maybe.fromValue(fn(this.value as T));
  }

  fold<R>(onNone: () => R, onSome: (value: T) => R): R {
    return this.isSome() ? onSome(this.value as T) : onNone();
  }
}
