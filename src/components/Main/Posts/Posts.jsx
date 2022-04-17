import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCommentsFromServerQuery } from '../../../redux/actionCreators/commentsActionCreator'

import { getPostsFromServerQuery } from '../../../redux/actionCreators/postsActionCreators'
import useDebounce from '../../CustomHooks/useDebounce'

import Post from './Post/Post'

function Posts() {
  // получение состояния постов и фильтра из Redux
  const posts = useSelector((store) => store.posts)
  const filter = useSelector((store) => store.filter)
  // получаем дебаунсер
  const debouncedFilter = useDebounce(filter, 300)
  // достаем dispatch
  const dispatch = useDispatch()
  // получаем данные из сервера при монтировании и при изменении значения debouncedFilter
  useEffect(() => {
    dispatch(getCommentsFromServerQuery())
    dispatch(getPostsFromServerQuery(debouncedFilter))
  }, [debouncedFilter])

  return (
    <Grid container spacing={2} sx={{ mt: 10 }}>
      {posts.map((post) => (
      // eslint-disable-next-line no-underscore-dangle
        <Post key={post._id} {...post} />
      ))}
    </Grid>

  )
}

export default Posts
