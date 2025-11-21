# Critical Fixes Needed

## 1. tRPC Fastify Adapter

**Issue**: The Fastify adapter import may not work as expected.

**Current Code** (`apps/router-api/src/index.ts`):
```typescript
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
```

**Possible Solutions**:

### Option A: Use HTTP adapter instead
```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// In route handler
server.get('/trpc/*', async (req, res) => {
  const response = await fetchRequestHandler({
    endpoint: '/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });
  return response;
});
```

### Option B: Check package version compatibility
- Ensure `@trpc/server` version matches Fastify adapter
- May need to use `@trpc/server@10.x` with compatible adapter

### Option C: Use standalone HTTP server
- Convert to Express or use tRPC standalone server

## 2. SDK Hash Functions

**Issue**: Placeholder hash functions in `packages/sdk/src/index.ts`.

**Fix**: Use proper keccak256:
```typescript
import { keccak256, toHex } from 'viem';

private stringToBytes32(str: string): `0x${string}` {
  return keccak256(toHex(str));
}
```

## 3. Node Agent Output Format

**Issue**: Ollama response format may differ from expected.

**Current**: Assumes `result.response` exists.

**Fix**: Handle Ollama API response correctly:
```python
response = await client.post(...)
result = response.json()
# Ollama returns {"response": "...", "done": true, ...}
output = result.get("response", "")
```

## 4. OCR Implementation

**Issue**: Placeholder OCR function.

**Fix**: Implement with PaddleOCR:
```python
from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='en')

def ocr_image(image_data: str) -> str:
    import base64
    from io import BytesIO
    from PIL import Image
    
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    
    result = ocr.ocr(np.array(image), cls=True)
    text = ' '.join([line[1][0] for line in result[0]])
    return text
```

## 5. Database Connection Pooling

**Issue**: May need connection retry logic.

**Fix**: Add retry and health checks:
```typescript
pool.on('error', (err) => {
  console.error('Database error:', err);
  // Implement reconnection logic
});
```

## 6. Queue Error Handling

**Issue**: Workers may fail silently.

**Fix**: Add comprehensive error handling:
```typescript
worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  // Retry logic or alerting
});
```

## 7. Environment Variables

**Issue**: Some services may not read `.env` correctly.

**Fix**: Ensure all services load environment variables:
- Router API: Uses `dotenv` ✅
- Verifier: Uses `dotenv` ✅
- Node Agent: Uses `pydantic-settings` ✅
- Dashboard: Uses Next.js env vars ✅

## 8. Contract Address Configuration

**Issue**: Contract address needs to be set in multiple places.

**Fix**: Centralize contract address:
- Set in `.env` as `CONTRACT_ADDRESS`
- All services read from environment
- SDK uses environment variable

## Testing Checklist

After fixes, test:

1. [ ] tRPC endpoints respond correctly
2. [ ] Task creation works
3. [ ] Node agents receive and process tasks
4. [ ] Verification calculates similarity correctly
5. [ ] On-chain receipt emission succeeds
6. [ ] Dashboard displays task status
7. [ ] Full E2E flow completes

