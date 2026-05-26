# TODO

- Segregate mapper logic from UI components (move mappers to `engine/mappers`).
- Separate reusable/common business logic from component files into `engine`.
- Move API payload builders and normalizers out of modal components into `engine`.
- Consolidate prediction-related contracts/types into a single contract module.
- Reduce in-component data transformation (`map/filter/reduce`) by precomputing view-models in engine selectors.
- Standardize import ordering across MoneyTrail (npm first, then local, alphabetically).
- Remove remaining dead code and unused style blocks in review modals/components.
- Add unit tests for prediction scoring/signature generation utilities.
- Add integration tests for review modal prediction apply/save flows.
- Document folder conventions: `components`, `engine`, `core/contracts`, and `pages/*/components`.
- Update backend expense/settlement endpoints to accept generic `appTxnId` (replace legacy `phonePeTxnId`) before frontend payload rename.
- Add 'App Used For Txn' Icon in the matched list items.