export class SafeMap<K extends string | number, V> {
  private data: Record<string, V>;

  constructor(initialData: Record<K, V> & { Default: V }) {
    this.data = initialData as Record<string, V>;
  }

  get(key: K): V {
    const stringKey = String(key);
    return stringKey in this.data ? this.data[stringKey] : this.data["Default"];
  }

  set(key: K, value: V): void {
    this.data[String(key)] = value;
  }

  has(key: K): boolean {
    return String(key) in this.data;
  }

  delete(key: K): void {
    const stringKey = String(key);
    if (stringKey === "Default") return;
    delete this.data[stringKey];
  }
}
