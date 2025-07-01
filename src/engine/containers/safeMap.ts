export class SafeMap<K extends string | number, V> {
  private data: Record<string, V>;

  constructor(initialData: Record<K, V> & { Default: V }) {
    this.data = initialData as Record<string, V>;
  }

  get(key: K): V {
    const strKey = String(key);
    return strKey in this.data ? this.data[strKey] : this.data["Default"];
  }

  set(key: K, value: V): void {
    this.data[String(key)] = value;
  }

  has(key: K): boolean {
    return String(key) in this.data;
  }

  delete(key: K): void {
    const strKey = String(key);
    if (strKey !== "Default") {
      delete this.data[strKey];
    }
  }
}