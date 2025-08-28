import { getData } from './api';

export const getAllPost = async (endpoint) => {
    try{
        return await getData('blogs');
    }catch(err){
        console.log(err);
        throw err;
    }
};
export const deletePost = async (PostId) => {
    try{
        return await deletePost('blogs/' + PostId);
    }catch(err){
        console.log(err);
        throw err;
    }
}
