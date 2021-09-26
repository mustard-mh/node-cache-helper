import * as NodeCache from "node-cache";
import { Options } from "node-cache";

export declare class NodeCacheHelper {
  instance: NodeCache;
  registerMap: Record<string, Function>;

  constructor(config?: Options);
  register(prefix: string, reloadFn: Function);
  resetKey(key: string): Promise<any>;
  get(key: string): Promise<any>;
}

export = NodeCacheHelper;
