import { CONTRACT_ADDRESS, MODULE_NAME } from "./constants";
import { client } from "./aptosClient";

export const borrowBook = async (signAndSubmitTransaction: any, bookId: number) => {
  const payload = {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::borrow_book`,
    type_arguments: [],
    arguments: [CONTRACT_ADDRESS, bookId], // pass `owner` (deployer) and book_id
  };

  const response = await signAndSubmitTransaction(payload);
  await client.waitForTransaction(response.hash);
  return response.hash;
};

export const returnBook = async (signAndSubmitTransaction: any, bookId: number) => {
  const payload = {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::return_book`,
    type_arguments: [],
    arguments: [CONTRACT_ADDRESS, bookId],
  };

  const response = await signAndSubmitTransaction(payload);
  await client.waitForTransaction(response.hash);
  return response.hash;
};

export const getAllBooks = async () => {
  const viewPayload = {
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_all_books`,
    type_arguments: [],
    arguments: [CONTRACT_ADDRESS],
  };

  const result = await client.view(viewPayload);
  return result;
};

export const getUserData = async (userAddress: string) => {
  const viewPayload = {
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_user_data`,
    type_arguments: [],
    arguments: [CONTRACT_ADDRESS, userAddress],
  };

  const result = await client.view(viewPayload);
  return {
    borrowed: result[0],
    returned: result[1],
  };
};
